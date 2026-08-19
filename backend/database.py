import sqlite3
import bcrypt
from config import Config


def get_db_connection():
    """Open a connection to the SQLite database."""
    conn = sqlite3.connect(Config.DATABASE_PATH)
    conn.row_factory = sqlite3.Row   # Rows behave like dicts
    return conn


def init_db():
    """
    Create the users table if it does not exist,
    then seed the 4 demo users with bcrypt-hashed passwords.
    """
    conn = get_db_connection()
    cursor = conn.cursor()

    # ── Create users table ────────────────────────────────────────────────────
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS users (
            id          INTEGER PRIMARY KEY AUTOINCREMENT,
            name        TEXT    NOT NULL,
            email       TEXT    NOT NULL UNIQUE,
            password    TEXT    NOT NULL,
            role        TEXT    NOT NULL CHECK(role IN (
                            'Student',
                            'HR / Company',
                            'Placement Officer',
                            'Admin'
                        )),
            reg_no      TEXT,
            branch      TEXT,
            batch       TEXT,
            phone       TEXT,
            location    TEXT,
            github      TEXT,
            linkedin    TEXT,
            created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    """)

    # ── Seed demo users (only if table is empty) ──────────────────────────────
    cursor.execute("SELECT COUNT(*) FROM users")
    count = cursor.fetchone()[0]

    if count == 0:
        demo_users = [
            {
                "name":     "Jayasurya K",
                "email":    "student@ait.edu.in",
                "password": "password123",
                "role":     "Student",
                "reg_no":   "20IT30104",
                "branch":   "B.Tech - Information Technology",
                "batch":    "2023 - 2027",
                "phone":    "+91 63749 09350",
                "location": "Coimbatore, Tamil Nadu",
                "github":   "github.com/jayasurya-k",
                "linkedin": "linkedin.com/in/jayasurya-k",
            },
            {
                "name":     "HR Manager (Google)",
                "email":    "recruiter@google.com",
                "password": "password123",
                "role":     "HR / Company",
                "reg_no":   None,
                "branch":   None,
                "batch":    None,
                "phone":    None,
                "location": None,
                "github":   None,
                "linkedin": None,
            },
            {
                "name":     "Dr. R. Placement Officer",
                "email":    "officer@ait.edu.in",
                "password": "password123",
                "role":     "Placement Officer",
                "reg_no":   None,
                "branch":   None,
                "batch":    None,
                "phone":    None,
                "location": None,
                "github":   None,
                "linkedin": None,
            },
            {
                "name":     "System Admin",
                "email":    "admin@ait.edu.in",
                "password": "password123",
                "role":     "Admin",
                "reg_no":   None,
                "branch":   None,
                "batch":    None,
                "phone":    None,
                "location": None,
                "github":   None,
                "linkedin": None,
            },
        ]

        for user in demo_users:
            # Hash password with bcrypt (cost factor 12)
            hashed_pw = bcrypt.hashpw(
                user["password"].encode("utf-8"),
                bcrypt.gensalt(rounds=12)
            ).decode("utf-8")

            cursor.execute("""
                INSERT INTO users
                    (name, email, password, role, reg_no, branch, batch, phone, location, github, linkedin)
                VALUES
                    (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """, (
                user["name"],
                user["email"],
                hashed_pw,
                user["role"],
                user["reg_no"],
                user["branch"],
                user["batch"],
                user["phone"],
                user["location"],
                user["github"],
                user["linkedin"],
            ))

        print(f"[OK] Database seeded with {len(demo_users)} demo users.")
    else:
        print(f"[INFO] Database already has {count} users - skipping seed.")

    conn.commit()
    conn.close()
    print("[OK] Database initialized at:", Config.DATABASE_PATH)
