from functools import wraps
from rest_framework.response import Response
from rest_framework import status
import jwt
from .jwt_utils import decode_jwt

def jwt_required(view_func):
    """
    Decorator to protect views with JWT authentication.
    Injects the decoded token payload into request.user_payload.
    """
    @wraps(view_func)
    def _wrapped_view(request, *args, **kwargs):
        auth_header = request.headers.get('Authorization')
        
        if not auth_header or not auth_header.startswith('Bearer '):
            return Response(
                {"error": "Authorization header missing or invalid. Format: 'Bearer <token>'"}, 
                status=status.HTTP_401_UNAUTHORIZED
            )
            
        token = auth_header.split(' ')[1]
        
        try:
            payload = decode_jwt(token)
            request.user_payload = payload
        except jwt.ExpiredSignatureError:
            return Response({"error": "Token has expired"}, status=status.HTTP_401_UNAUTHORIZED)
        except jwt.InvalidTokenError:
            return Response({"error": "Invalid token"}, status=status.HTTP_401_UNAUTHORIZED)
            
        return view_func(request, *args, **kwargs)
        
    return _wrapped_view
