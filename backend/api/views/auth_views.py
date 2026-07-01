from rest_framework.decorators import api_view
from rest_framework import status
from api.services.auth_service import AuthService
from api.utils.responses import api_response
from api.utils.decorators import jwt_required

@api_view(['POST'])
def register(request):
    """
    Register a new user using Service Pattern.
    """
    data = request.data
    email = data.get('email')
    password = data.get('password')
    full_name = data.get('full_name')
    role = data.get('role', 'farmer')
    
    success, message, result = AuthService.register_user(email, password, full_name, role)
    
    if not success:
        # Determine status code based on error message
        status_code = status.HTTP_500_INTERNAL_SERVER_ERROR if "Database" in message else status.HTTP_400_BAD_REQUEST
        return api_response(success=False, message=message, errors={"error": message}, status_code=status_code)
        
    return api_response(success=True, message=message, data=result, status_code=status.HTTP_201_CREATED)


@api_view(['POST'])
def login(request):
    """
    Authenticate user using Service Pattern.
    """
    data = request.data
    email = data.get('email')
    password = data.get('password')
    
    success, message, result = AuthService.login_user(email, password)
    
    if not success:
        return api_response(success=False, message=message, errors={"error": message}, status_code=status.HTTP_401_UNAUTHORIZED)
        
    return api_response(success=True, message=message, data=result, status_code=status.HTTP_200_OK)


@api_view(['GET'])
@jwt_required
def get_me(request):
    """
    Get current logged-in user profile.
    """
    user_id = request.user_payload.get('user_id')
    
    success, message, result = AuthService.get_user_profile(user_id)
    
    if not success:
        return api_response(success=False, message=message, errors={"error": message}, status_code=status.HTTP_404_NOT_FOUND)
        
    return api_response(success=True, message=message, data=result, status_code=status.HTTP_200_OK)
