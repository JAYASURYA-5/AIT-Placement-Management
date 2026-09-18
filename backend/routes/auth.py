from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token
from models import get_user_by_email, verify_password, get_user_by_id, safe_user
from middleware.auth_middleware import token_required

# Create a Blueprint for all /api/auth routes
auth_bp = Blueprint("auth", __name__, url_prefix="/api/auth")


# ──────────────────────────────────────────────────────────────────────────────
# POST /api/auth/login
# ──────────────────────────────────────────────────────────────────────────────
@auth_bp.route("/login", methods=["POST"])
def login():
    """
    Login endpoint — validates credentials and returns a JWT token.

    Request Body (JSON):
        {
            "email":    "student@ait.edu.in",
            "password": "password123",
            "role":     "Student"
        }

    Success Response (200):
        {
            "success": true,
            "message": "Login successful",
            "token":   "<jwt_token>",
            "user": {
                "id":    1,
                "name":  "Jayasurya K",
                "email": "student@ait.edu.in",
                "role":  "Student",
                ...
            }
        }

    Error Responses:
        400 — Missing fields
        401 — Wrong password
        403 — Role mismatch
        404 — User not found
    """
    data = request.get_json()

    # ── Validate request payload ───────────────────────────────────────────────
    if not data:
        return jsonify({
            "success": False,
            "error": "Request body must be JSON."
        }), 400

    email    = data.get("email", "").strip().lower()
    password = data.get("password", "")
    role     = data.get("role", "")

    if not email:
        return jsonify({
            "success": False,
            "error": "Email is required."
        }), 400

    if not password:
        return jsonify({
            "success": False,
            "error": "Password is required."
        }), 400

    if not role:
        return jsonify({
            "success": False,
            "error": "Role is required."
        }), 400

    # ── Look up user by email ──────────────────────────────────────────────────
    user = get_user_by_email(email)

    if user is None:
        return jsonify({
            "success": False,
            "error": "No account found with this email address."
        }), 404

    # ── Verify password ────────────────────────────────────────────────────────
    if not verify_password(password, user["password"]):
        return jsonify({
            "success": False,
            "error": "Incorrect password. Please try again."
        }), 401

    # ── Verify role matches ────────────────────────────────────────────────────
    if user["role"] != role:
        return jsonify({
            "success": False,
            "error": f"This account is registered as '{user['role']}', not '{role}'."
        }), 403

    # ── Generate JWT token ─────────────────────────────────────────────────────
    # identity = user's database ID (integer stored as string in JWT)
    access_token = create_access_token(identity=str(user["id"]))

    # ── Return success response ────────────────────────────────────────────────
    return jsonify({
        "success": True,
        "message": f"Welcome back, {user['name']}!",
        "token":   access_token,
        "user":    safe_user(user),
    }), 200


# ──────────────────────────────────────────────────────────────────────────────
# GET /api/auth/me   (Protected)
# ──────────────────────────────────────────────────────────────────────────────
@auth_bp.route("/me", methods=["GET"])
@token_required
def get_me(current_user):
    """
    Returns the currently authenticated user's profile from JWT.

    Headers:
        Authorization: Bearer <token>

    Success Response (200):
        {
            "success": true,
            "user": { ... }
        }
    """
    return jsonify({
        "success": True,
        "user":    safe_user(current_user),
    }), 200


# ──────────────────────────────────────────────────────────────────────────────
# POST /api/auth/logout
# ──────────────────────────────────────────────────────────────────────────────
@auth_bp.route("/logout", methods=["POST"])
@token_required
def logout(current_user):
    """
    Logout endpoint.
    Since JWTs are stateless, logout is handled client-side by deleting the token.
    This endpoint confirms the action and can be extended to a token blacklist.

    Success Response (200):
        {
            "success": true,
            "message": "Logged out successfully."
        }
    """
    return jsonify({
        "success": True,
        "message": f"Goodbye, {current_user['name']}! Logged out successfully.",
    }), 200


# ──────────────────────────────────────────────────────────────────────────────
# GET /api/auth/health
# ──────────────────────────────────────────────────────────────────────────────
@auth_bp.route("/health", methods=["GET"])
def health():
    """Simple health check — confirms the auth API is running."""
    return jsonify({
        "success": True,
        "message": "AIT Placement Auth API is running ✅",
        "version": "1.0.0",
    }), 200
