from pwdlib import PasswordHash

password_hash = PasswordHash.recommended()
DUMMY_HASH = password_hash.hash("dummy_password")

def hash_password(password: str) -> str:
    """Hash a password using aragon2.ciffi"""
    return password_hash.hash(password)

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify a password against a hashed password."""
    try:
        return password_hash.verify(plain_password, hashed_password)
    except Exception:
        return False
    