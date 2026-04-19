from datetime import datetime, timedelta, timezone
import jwt
import bcrypt
from config import settings

# NOTE: We use the bcrypt library directly instead of passlib.
# passlib's internal wrap-bug test itself uses a 73-byte string which crashes
# on modern bcrypt versions. Bypassing passlib is the only reliable fix.

def _to_bytes(password: str) -> bytes:
    """Encode password to UTF-8 bytes, truncated to 72 bytes (bcrypt hard limit)."""
    encoded = password.encode("utf-8")
    return encoded[:72]

def verify_password(plain_password: str, hashed_password: str) -> bool:
    try:
        return bcrypt.checkpw(_to_bytes(plain_password), hashed_password.encode("utf-8"))
    except Exception:
        return False

def get_password_hash(password: str) -> str:
    salt = bcrypt.gensalt()
    hashed = bcrypt.hashpw(_to_bytes(password), salt)
    return hashed.decode("utf-8")

def create_access_token(data: dict, expires_delta: timedelta = None) -> str:
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, settings.jwt_secret, algorithm=settings.jwt_algorithm)
    return encoded_jwt
