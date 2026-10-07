from fastapi import APIRouter, HTTPException, Depends, status, Request
from sqlalchemy.orm import Session
from typing import List, Dict, Any

from app.domain.schemas import (
    UserRegister, UserLogin, GoogleOAuthLogin, TokenResponse, RefreshTokenRequest,
    ForgotPasswordRequest, ResetPasswordRequest, OTPVerifyRequest,
    WizardCompleteRequest, UserProfileResponse, UserProfileUpdate, DeviceResponse
)
from app.services.auth_service import AuthService
from app.api.deps import get_db, get_current_user, require_roles
from app.domain.models import User

router = APIRouter(prefix="/auth", tags=["Authentication"])

@router.post("/register", response_model=TokenResponse, status_code=status.HTTP_201_CREATED)
async def register(user_in: UserRegister, request: Request, db: Session = Depends(get_db)):
    user = AuthService.register_user(db, user_in)
    # Auto-login after registration
    login_req = UserLogin(email=user_in.email, password=user_in.password)
    return AuthService.authenticate_user(db, login_req, request)

@router.post("/login", response_model=TokenResponse)
async def login(login_in: UserLogin, request: Request, db: Session = Depends(get_db)):
    return AuthService.authenticate_user(db, login_in, request)

@router.post("/logout")
async def logout(current_user: User = Depends(get_current_user)):
    return {"message": "Logged out successfully"}

@router.post("/refresh", response_model=TokenResponse)
async def refresh_token(req: RefreshTokenRequest, db: Session = Depends(get_db)):
    return AuthService.refresh_access_token(db, req.refresh_token)

@router.post("/google", response_model=TokenResponse)
async def google_login(google_in: GoogleOAuthLogin, request: Request, db: Session = Depends(get_db)):
    return AuthService.google_oauth_login(db, google_in, request)

@router.post("/otp/send")
async def send_otp(req: ForgotPasswordRequest, db: Session = Depends(get_db)):
    otp = AuthService.send_email_otp(db, req.email)
    return {"message": "OTP code generated successfully", "otp_code_demo": otp}

@router.post("/otp/verify")
async def verify_otp(req: OTPVerifyRequest, db: Session = Depends(get_db)):
    AuthService.verify_otp(db, req)
    return {"message": "OTP verified successfully"}

@router.post("/forgot-password")
async def forgot_password(req: ForgotPasswordRequest, db: Session = Depends(get_db)):
    otp = AuthService.send_email_otp(db, req.email)
    return {"message": "Password reset OTP sent to email", "otp_code_demo": otp}

@router.post("/reset-password")
async def reset_password(req: ResetPasswordRequest, db: Session = Depends(get_db)):
    AuthService.reset_password(db, req)
    return {"message": "Password reset successfully. You can now login with your new password."}

@router.get("/me")
async def get_me(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    return AuthService.get_user_profile_dict(db, current_user)

@router.put("/profile")
async def update_profile(
    profile_in: UserProfileUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if profile_in.full_name:
        current_user.full_name = profile_in.full_name
    if profile_in.phone_number:
        current_user.phone_number = profile_in.phone_number
    if profile_in.avatar_url:
        current_user.avatar_url = profile_in.avatar_url
    if profile_in.language:
        current_user.language = profile_in.language

    db.commit()
    return AuthService.get_user_profile_dict(db, current_user)

@router.post("/wizard/complete")
async def complete_wizard(
    wizard_in: WizardCompleteRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    updated_user = AuthService.complete_first_login_wizard(db, current_user, wizard_in)
    return AuthService.get_user_profile_dict(db, updated_user)

@router.get("/devices")
async def get_devices(
    request: Request,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    current_ip = request.client.host if request.client else "127.0.0.1"
    return AuthService.get_user_devices(db, current_user.id, current_ip)

@router.post("/devices/logout-others")
async def logout_others(
    request: Request,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    current_ip = request.client.host if request.client else "127.0.0.1"
    count = AuthService.logout_other_devices(db, current_user.id, current_ip)
    return {"message": f"Successfully logged out of {count} other sessions."}

@router.get("/roles")
async def list_roles():
    return [
        {"role": "farmer", "label": "Farmer", "description": "Access to personal crop digital twin, pest diagnosis, weather & market alerts"},
        {"role": "officer", "label": "Agricultural Officer", "description": "District-level crop health monitoring and field advisory management"},
        {"role": "govt", "label": "Government Officer", "description": "State analytics, yield estimations, and subsidy policy dashboards"},
        {"role": "researcher", "label": "Researcher", "description": "Anonymized agro-dataset queries, ML engine experiments & model validation"},
        {"role": "admin", "label": "Administrator", "description": "Full system configuration, user role management, & security logs"}
    ]
