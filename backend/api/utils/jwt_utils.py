import jwt
import os
import datetime
from django.conf import settings

# In case SECRET_KEY is not loaded properly in tests, fallback to env directly
JWT_SECRET = os.getenv('JWT_SECRET_KEY', getattr(settings, 'SECRET_KEY', 'django-insecure-default-key'))

def generate_jwt(user_id, role="farmer"):
    """
    Generates a JWT token for a given user ID and role.
    """
    payload = {
        'user_id': str(user_id),
        'role': role,
        'exp': datetime.datetime.now(datetime.timezone.utc) + datetime.timedelta(days=7),
        'iat': datetime.datetime.now(datetime.timezone.utc)
    }
    token = jwt.encode(payload, JWT_SECRET, algorithm='HS256')
    return token

def decode_jwt(token):
    """
    Decodes a JWT token and returns the payload.
    Raises jwt.ExpiredSignatureError or jwt.InvalidTokenError on failure.
    """
    return jwt.decode(token, JWT_SECRET, algorithms=['HS256'])
