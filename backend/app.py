"""
AIT Placement Management Portal — Flask Backend
================================================
Main application entry point.

Endpoints:
  GET  /                         → API info
  POST /api/auth/login           → Login with email + password + role
  GET  /api/auth/me              → Get current user from JWT (protected)
  POST /api/auth/logout          → Logout confirmation (protected)
  GET  /api/auth/health          → Health check

Run:
  python app.py

Requires:
  pip install -r requirements.txt
"""

import sys
import os
from flask import Flask, jsonify
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from datetime import timedelta

# ── Allow imports from this directory ─────────────────────────────────────────
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from config import Config
from database import init_db
from routes.auth import auth_bp


def create_app():
    """Application factory — creates and configures the Flask app."""
    app = Flask(__name__)

    # ── Load configuration ─────────────────────────────────────────────────────
    app.config["SECRET_KEY"]              = Config.SECRET_KEY
    app.config["JWT_SECRET_KEY"]          = Config.JWT_SECRET_KEY
    app.config["JWT_ACCESS_TOKEN_EXPIRES"] = timedelta(seconds=Config.JWT_ACCESS_TOKEN_EXPIRES)

    # ── Initialize extensions ──────────────────────────────────────────────────
    CORS(app, resources={r"/api/*": {"origins": Config.CORS_ORIGINS}})
    jwt = JWTManager(app)

    # ── Register Blueprints ────────────────────────────────────────────────────
    app.register_blueprint(auth_bp)

    # ── Root route ─────────────────────────────────────────────────────────────
    @app.route("/")
    def index():
        return jsonify({
            "name":    "AIT Placement Management Portal — Backend API",
            "version": "1.0.0",
            "status":  "running",
            "routes": {
                "login":  "POST /api/auth/login",
                "me":     "GET  /api/auth/me",
                "logout": "POST /api/auth/logout",
                "health": "GET  /api/auth/health",
            }
        })

    # ── JWT error handlers ─────────────────────────────────────────────────────
    @jwt.unauthorized_loader
    def missing_token(reason):
        return jsonify({
            "success": False,
            "error":   f"Authorization token missing: {reason}"
        }), 401

    @jwt.invalid_token_loader
    def invalid_token(reason):
        return jsonify({
            "success": False,
            "error":   f"Invalid token: {reason}"
        }), 401

    @jwt.expired_token_loader
    def expired_token(jwt_header, jwt_payload):
        return jsonify({
            "success": False,
            "error":   "Your session has expired. Please log in again."
        }), 401

    # ── 404 handler ────────────────────────────────────────────────────────────
    @app.errorhandler(404)
    def not_found(e):
        return jsonify({
            "success": False,
            "error":   "Route not found."
        }), 404

    # ── 500 handler ────────────────────────────────────────────────────────────
    @app.errorhandler(500)
    def server_error(e):
        return jsonify({
            "success": False,
            "error":   "Internal server error."
        }), 500

    return app


# ── Entry point ────────────────────────────────────────────────────────────────
if __name__ == "__main__":
    print("=" * 55)
    print("  AIT Placement Portal — Flask Backend")
    print("=" * 55)

    # Initialize database and seed demo users
    init_db()

    # Create and run the app
    app = create_app()

    print(f"\n[START] Server running at: http://localhost:{Config.PORT}")
    print(f"[API]   Login endpoint:    POST http://localhost:{Config.PORT}/api/auth/login")
    print(f"[API]   Health check:      GET  http://localhost:{Config.PORT}/api/auth/health")
    print("\n[DEMO CREDENTIALS]")
    print("   Student:           student@ait.edu.in  /  password123")
    print("   HR / Company:      recruiter@google.com /  password123")
    print("   Placement Officer: officer@ait.edu.in   /  password123")
    print("   Admin:             admin@ait.edu.in     /  password123")
    print("=" * 55)

    app.run(
        host="0.0.0.0",
        port=Config.PORT,
        debug=True
    )
