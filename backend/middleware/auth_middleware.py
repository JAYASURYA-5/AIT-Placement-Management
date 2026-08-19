from functools import wraps
from flask import request, jsonify
from flask_jwt_extended import verify_jwt_in_request, get_jwt_identity
from models import get_user_by_id


def token_required(f):
    """
    Decorator to protect routes that require a valid JWT token.

    Usage:
        @app.route('/api/protected')
        @token_required
        def protected_route(current_user):
            return jsonify({ "user": current_user })

    The decorated function receives `current_user` as the first argument —
    a dict with the full user row (password excluded).
    """
    @wraps(f)
    def decorated(*args, **kwargs):
        try:
            # Verify the JWT in the Authorization header
            verify_jwt_in_request()

            # Get the user ID stored in the token's identity field
            user_id = get_jwt_identity()

            # Fetch fresh user data from DB
            current_user = get_user_by_id(user_id)
            if current_user is None:
                return jsonify({
                    "success": False,
                    "error": "User not found. Token may be invalid."
                }), 401

        except Exception as e:
            return jsonify({
                "success": False,
                "error": f"Token error: {str(e)}"
            }), 401

        # Pass the user dict into the wrapped route function
        return f(current_user, *args, **kwargs)

    return decorated
