import uuid
from datetime import datetime, timezone, timedelta
from typing import Optional, Dict, Any, List
from sqlalchemy.orm import Session
from sqlalchemy.future import select
from fastapi import HTTPException, status, Request

from app.domain.models import User, UserProfile, RefreshToken, UserSession, OTPVerification, UserRoleEnum
from app.domain.schemas import (
    UserRegister, UserLogin, GoogleOAuthLogin, WizardCompleteRequest,
    UserProfileUpdate, OTPVerifyRequest, ResetPasswordRequest
)
from app.core.security import (
    get_password_hash, verify_password, create_access_token, create_refresh_token,
    verify_token, generate_otp_code
)
from app.core.config import settings

class AuthService:
    @staticmethod
    def parse_user_agent(request: Request) -> Dict[str, str]:
        ua_string = request.headers.get("user-agent", "")
        ip_address = request.client.host if request.client else "127.0.0.1"
        
        browser = "Chrome / Modern Browser"
        os = "Windows / Cross Platform"
        if "Firefox" in ua_string:
            browser = "Firefox"
        elif "Safari" in ua_string and "Chrome" not in ua_string:
            browser = "Safari"
        elif "Edg" in ua_string:
            browser = "Edge"
            
        if "Android" in ua_string:
            os = "Android"
        elif "iPhone" in ua_string or "iPad" in ua_string:
            os = "iOS"
        elif "Macintosh" in ua_string:
            os = "macOS"
        elif "Linux" in ua_string:
            os = "Linux"

        device_name = f"{browser} on {os}"
        return {
            "ip_address": ip_address,
            "browser": browser,
            "os": os,
            "device_name": device_name,
            "user_agent": ua_string,
            "country": "Local / Verified"
        }


    @staticmethod
    def register_user(db: Session, user_in: UserRegister) -> User:
        # Check email duplicate
        existing = db.query(User).filter(User.email == user_in.email.lower()).first()
        if existing:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="User with this email already exists."
            )
        
        # Validate role
        try:
            role_enum = UserRoleEnum(user_in.role.lower())
        except ValueError:
            role_enum = UserRoleEnum.FARMER

        hashed_pwd = get_password_hash(user_in.password)
        user = User(
            email=user_in.email.lower(),
            password_hash=hashed_pwd,
            full_name=user_in.full_name,
            phone_number=user_in.phone_number,
            role=role_enum,
            is_active=True,
            is_verified=False,
            is_wizard_completed=False
        )
        db.add(user)
        db.commit()
        db.refresh(user)

        # Create blank profile
        profile = UserProfile(user_id=user.id)
        db.add(profile)
        db.commit()

        return user

    @staticmethod
    def authenticate_user(db: Session, login_in: UserLogin, request: Request) -> Dict[str, Any]:
        user = db.query(User).filter(User.email == login_in.email.lower()).first()
        if not user or not verify_password(login_in.password, user.password_hash):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid credentials."
            )

        if not user.is_active:
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Account is disabled.")

        access_token = create_access_token(subject=user.id, role=user.role.value)
        refresh_token = create_refresh_token(subject=user.id)

        # Store Refresh Token
        rt_obj = RefreshToken(
            user_id=user.id,
            token_hash=get_password_hash(refresh_token),
            expires_at=datetime.now(timezone.utc) + timedelta(days=settings.REFRESH_TOKEN_EXPIRE_DAYS)
        )
        db.add(rt_obj)

        # Register Device / Session
        dev_info = AuthService.parse_user_agent(request)
        session = UserSession(
            user_id=user.id,
            ip_address=dev_info["ip_address"],
            user_agent=dev_info["user_agent"],
            device_name=dev_info["device_name"],
            country=dev_info["country"]
        )
        db.add(session)
        db.commit()

        user_dict = AuthService.get_user_profile_dict(db, user)

        return {
            "access_token": access_token,
            "refresh_token": refresh_token,
            "token_type": "bearer",
            "expires_in": settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60,
            "user": user_dict
        }

    @staticmethod
    def google_oauth_login(db: Session, google_in: GoogleOAuthLogin, request: Request) -> Dict[str, Any]:
        email = google_in.email.lower() if google_in.email else f"google_{uuid.uuid4().hex[:8]}@agrimind.ai"
        user = db.query(User).filter(User.email == email).first()

        if not user:
            user = User(
                email=email,
                password_hash=get_password_hash(uuid.uuid4().hex),
                full_name=google_in.full_name or "Google User",
                role=UserRoleEnum.FARMER,
                is_active=True,
                is_verified=True,
                is_wizard_completed=False,
                avatar_url=google_in.avatar_url
            )
            db.add(user)
            db.commit()
            db.refresh(user)

            profile = UserProfile(user_id=user.id)
            db.add(profile)
            db.commit()

        access_token = create_access_token(subject=user.id, role=user.role.value)
        refresh_token = create_refresh_token(subject=user.id)

        dev_info = AuthService.parse_user_agent(request)
        session = UserSession(
            user_id=user.id,
            ip_address=dev_info["ip_address"],
            user_agent=dev_info["user_agent"],
            device_name=dev_info["device_name"],
            country=dev_info["country"]
        )
        db.add(session)
        db.commit()

        user_dict = AuthService.get_user_profile_dict(db, user)

        return {
            "access_token": access_token,
            "refresh_token": refresh_token,
            "token_type": "bearer",
            "expires_in": settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60,
            "user": user_dict
        }

    @staticmethod
    def refresh_access_token(db: Session, refresh_token: str) -> Dict[str, Any]:
        payload = verify_token(refresh_token, secret_key=settings.REFRESH_SECRET_KEY)
        if not payload or payload.get("type") != "refresh":
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid refresh token.")

        user_id = payload.get("sub")
        user = db.query(User).filter(User.id == user_id).first()
        if not user or not user.is_active:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="User inactive or not found.")

        new_access_token = create_access_token(subject=user.id, role=user.role.value)
        new_refresh_token = create_refresh_token(subject=user.id)

        user_dict = AuthService.get_user_profile_dict(db, user)

        return {
            "access_token": new_access_token,
            "refresh_token": new_refresh_token,
            "token_type": "bearer",
            "expires_in": settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60,
            "user": user_dict
        }

    @staticmethod
    def send_email_otp(db: Session, email: str) -> str:
        otp_code = generate_otp_code(6)
        expires_at = datetime.now(timezone.utc) + timedelta(minutes=settings.OTP_EXPIRE_MINUTES)
        
        otp_entry = OTPVerification(
            email=email.lower(),
            otp_code=otp_code,
            expires_at=expires_at,
            used=False
        )
        db.add(otp_entry)
        db.commit()
        return otp_code

    @staticmethod
    def verify_otp(db: Session, req: OTPVerifyRequest) -> bool:
        entry = db.query(OTPVerification).filter(
            OTPVerification.email == req.email.lower(),
            OTPVerification.otp_code == req.otp_code,
            OTPVerification.used == False,
            OTPVerification.expires_at > datetime.now(timezone.utc)
        ).order_by(OTPVerification.created_at.desc()).first()

        if not entry:
            raise HTTPException(status_code=400, detail="Invalid or expired OTP code.")

        entry.used = True
        
        # Verify user if registered
        user = db.query(User).filter(User.email == req.email.lower()).first()
        if user:
            user.is_verified = True

        db.commit()
        return True

    @staticmethod
    def reset_password(db: Session, req: ResetPasswordRequest) -> bool:
        # Verify OTP first
        AuthService.verify_otp(db, OTPVerifyRequest(email=req.email, otp_code=req.otp_code))
        
        user = db.query(User).filter(User.email == req.email.lower()).first()
        if not user:
            raise HTTPException(status_code=404, detail="User not found.")

        user.password_hash = get_password_hash(req.new_password)
        db.commit()
        return True

    @staticmethod
    def complete_first_login_wizard(db: Session, user: User, wizard_in: WizardCompleteRequest) -> User:
        user.full_name = wizard_in.step1.full_name
        user.phone_number = wizard_in.step1.phone_number
        user.language = wizard_in.step1.language
        user.is_wizard_completed = True

        profile = db.query(UserProfile).filter(UserProfile.user_id == user.id).first()
        if not profile:
            profile = UserProfile(user_id=user.id)
            db.add(profile)

        profile.farm_name = wizard_in.step2.farm_name
        profile.farm_size_acres = wizard_in.step2.farm_size_acres
        profile.address = wizard_in.step2.address
        profile.state = wizard_in.step2.state
        profile.district = wizard_in.step2.district
        profile.village = wizard_in.step2.village

        profile.crop_types = wizard_in.step3.crop_types

        profile.latitude = wizard_in.step4.latitude
        profile.longitude = wizard_in.step4.longitude

        profile.notification_preferences = wizard_in.step5.model_dump()

        db.commit()
        db.refresh(user)
        return user

    @staticmethod
    def get_user_profile_dict(db: Session, user: User) -> Dict[str, Any]:
        profile = db.query(UserProfile).filter(UserProfile.user_id == user.id).first()
        return {
            "id": str(user.id),
            "email": user.email,
            "full_name": user.full_name,
            "phone_number": user.phone_number,
            "role": user.role.value if hasattr(user.role, 'value') else str(user.role),
            "is_active": user.is_active,
            "is_verified": user.is_verified,
            "is_wizard_completed": user.is_wizard_completed,
            "avatar_url": user.avatar_url,
            "language": user.language,
            "address": profile.address if profile else None,
            "state": profile.state if profile else None,
            "district": profile.district if profile else None,
            "village": profile.village if profile else None,
            "farm_name": profile.farm_name if profile else None,
            "farm_size_acres": profile.farm_size_acres if profile else None,
            "crop_types": profile.crop_types if profile else [],
            "latitude": profile.latitude if profile else None,
            "longitude": profile.longitude if profile else None,
            "notification_preferences": profile.notification_preferences if profile else {},
            "created_at": user.created_at.isoformat() if user.created_at else None
        }

    @staticmethod
    def get_user_devices(db: Session, user_id: uuid.UUID, current_ip: str) -> List[Dict[str, Any]]:
        sessions = db.query(UserSession).filter(UserSession.user_id == user_id).order_by(UserSession.last_active.desc()).all()
        result = []
        for s in sessions:
            result.append({
                "id": str(s.id),
                "device_name": s.device_name or "Desktop Device",
                "browser": "Chrome",
                "os": "Windows / Cross Platform",
                "ip_address": s.ip_address,
                "country": s.country or "India",
                "login_time": s.created_at.isoformat(),
                "last_active": s.last_active.isoformat(),
                "is_current": (s.ip_address == current_ip)
            })
        return result

    @staticmethod
    def logout_other_devices(db: Session, user_id: uuid.UUID, current_ip: str) -> int:
        count = db.query(UserSession).filter(
            UserSession.user_id == user_id,
            UserSession.ip_address != current_ip
        ).delete(synchronize_session=False)
        db.commit()
        return count
