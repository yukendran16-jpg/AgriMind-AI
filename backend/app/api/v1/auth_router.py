from fastapi import APIRouter, HTTPException, Depends, status
from app.domain.schemas import UserCreate, UserResponse, Token, LoginRequest
from app.core.security import create_access_token, verify_password, get_password_hash
from datetime import datetime, timezone
import uuid

router = APIRouter(prefix="/auth", tags=["Authentication"])

# In-memory user database stub for portable zero-config execution
USERS_DB = {
    "farmer@agrimind.ai": {
        "id": "usr_001",
        "email": "farmer@agrimind.ai",
        "full_name": "Ramesh Patel",
        "role": "farmer",
        "hashed_password": get_password_hash("farmer123"),
        "created_at": datetime.now(timezone.utc)
    }
}

@router.post("/register", response_model=Token, status_code=status.HTTP_201_CREATED)
async def register_user(user_in: UserCreate):
    if user_in.email in USERS_DB:
        raise HTTPException(status_code=400, detail="User with this email already exists.")
    
    user_id = f"usr_{uuid.uuid4().hex[:6]}"
    hashed_pwd = get_password_hash(user_in.password)
    
    user_record = {
        "id": user_id,
        "email": user_in.email,
        "full_name": user_in.full_name,
        "role": user_in.role,
        "hashed_password": hashed_pwd,
        "created_at": datetime.now(timezone.utc)
    }
    USERS_DB[user_in.email] = user_record
    
    token = create_access_token(subject=user_id)
    return Token(
        access_token=token,
        token_type="bearer",
        user=UserResponse(**user_record)
    )

@router.post("/login", response_model=Token)
async def login_user(login_in: LoginRequest):
    user = USERS_DB.get(login_in.email)
    if not user or not verify_password(login_in.password, user["hashed_password"]):
        raise HTTPException(status_code=401, detail="Invalid email or password.")
    
    token = create_access_token(subject=user["id"])
    return Token(
        access_token=token,
        token_type="bearer",
        user=UserResponse(**user)
    )
