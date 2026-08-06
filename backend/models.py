import bcrypt
from database import get_db_connection


def get_user_by_email(email: str) -> dict | None:
    """
    Fetch a single user row by email address.
    Returns a dict if found, None if not found.
    """
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM users WHERE email = ?", (email.strip().lower(),))
    row = cursor.fetchone()
    conn.close()

    if row is None:
        return None

    # Convert sqlite3.Row → plain dict
    return dict(row)


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """
    Compare a plain-text password against a stored bcrypt hash.
    Returns True if they match, False otherwise.
    """
    return bcrypt.checkpw(
        plain_password.encode("utf-8"),
        hashed_password.encode("utf-8")
    )


def get_user_by_id(user_id: int) -> dict | None:
    """
    Fetch a single user row by primary key ID.
    Used for token identity verification.
    """
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM users WHERE id = ?", (user_id,))
    row = cursor.fetchone()
    conn.close()
    return dict(row) if row else None


def safe_user(user: dict) -> dict:
    """
    Strip the password field before sending user data to the client.
    Never return hashed passwords in API responses.
    """
    return {
        "id":       user["id"],
        "name":     user["name"],
        "email":    user["email"],
        "role":     user["role"],
        "reg_no":   user.get("reg_no"),
        "branch":   user.get("branch"),
        "batch":    user.get("batch"),
        "phone":    user.get("phone"),
        "location": user.get("location"),
        "github":   user.get("github"),
        "linkedin": user.get("linkedin"),
    }
