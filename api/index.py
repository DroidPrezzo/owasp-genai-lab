"""Vercel serverless adapter — exposes the Flask app as a handler."""
import sys
import os

# Add project root to Python path so imports work in Vercel
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app import create_app

app = create_app()
