import os
from rest_framework.decorators import api_view, parser_classes
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
from rest_framework import status
from django.conf import settings
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


@api_view(['GET'])
@jwt_required
def get_profile(request):
    """
    GET /api/v1/profile/ — Get profile (alias for get_me).
    """
    user_id = request.user_payload.get('user_id')
    success, message, result = AuthService.get_user_profile(user_id)
    if not success:
        return api_response(success=False, message=message, errors={"error": message}, status_code=status.HTTP_404_NOT_FOUND)
    return api_response(success=True, message=message, data=result, status_code=status.HTTP_200_OK)


@api_view(['PUT'])
@jwt_required
def update_profile(request):
    """
    PUT /api/v1/auth/profile/ — Update farmer profile (backward-compatible).
    """
    user_id = request.user_payload.get('user_id')
    data = request.data

    profile_data = {
        'state': data.get('state'),
        'district': data.get('district'),
        'main_crop': data.get('main_crop'),
        'farm_size': data.get('farm_size'),
        'full_name': data.get('full_name'),
        'mobile': data.get('mobile'),
        'soil_type': data.get('soil_type'),
    }
    # Remove None values
    profile_data = {k: v for k, v in profile_data.items() if v is not None}

    success, message, result = AuthService.update_user_profile(user_id, profile_data)

    if not success:
        return api_response(success=False, message=message, errors={"error": message}, status_code=status.HTTP_400_BAD_REQUEST)

    return api_response(success=True, message=message, data=result, status_code=status.HTTP_200_OK)


@api_view(['PUT'])
@jwt_required
def profile_update(request):
    """
    PUT /api/v1/profile/update/ — Update farmer profile (new endpoint).
    """
    user_id = request.user_payload.get('user_id')
    data = request.data

    profile_data = {
        'state': data.get('state'),
        'district': data.get('district'),
        'main_crop': data.get('main_crop'),
        'farm_size': data.get('farm_size'),
        'full_name': data.get('full_name'),
        'mobile': data.get('mobile'),
        'soil_type': data.get('soil_type'),
    }
    # Remove None values
    profile_data = {k: v for k, v in profile_data.items() if v is not None}

    success, message, result = AuthService.update_user_profile(user_id, profile_data)

    if not success:
        return api_response(
            success=False,
            message=message,
            errors={"error": message},
            status_code=status.HTTP_400_BAD_REQUEST
        )

    return api_response(success=True, message=message, data=result, status_code=status.HTTP_200_OK)


@api_view(['POST'])
@jwt_required
@parser_classes([MultiPartParser, FormParser])
def upload_profile_image(request):
    """
    POST /api/v1/profile/upload-image/ — Upload profile photo.
    Saves image to /media/profile_images/ and stores path in MongoDB.
    """
    user_id = request.user_payload.get('user_id')

    if 'image' not in request.FILES:
        return api_response(
            success=False,
            message="No image file provided",
            errors={"image": "Required"},
            status_code=status.HTTP_400_BAD_REQUEST
        )

    image_file = request.FILES['image']

    # Validate file type
    allowed_types = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg']
    if image_file.content_type not in allowed_types:
        return api_response(
            success=False,
            message="Invalid file type. Only JPEG, PNG, and WebP are allowed.",
            errors={"image": "Invalid type"},
            status_code=status.HTTP_400_BAD_REQUEST
        )

    # Validate file size (max 5MB)
    if image_file.size > 5 * 1024 * 1024:
        return api_response(
            success=False,
            message="File too large. Maximum size is 5MB.",
            errors={"image": "Too large"},
            status_code=status.HTTP_400_BAD_REQUEST
        )

    # Save image to media/profile_images/
    upload_dir = os.path.join(settings.MEDIA_ROOT, 'profile_images')
    os.makedirs(upload_dir, exist_ok=True)

    # Use user_id as filename to always overwrite old photo
    ext = os.path.splitext(image_file.name)[1].lower()
    filename = f"{user_id}{ext}"
    filepath = os.path.join(upload_dir, filename)

    with open(filepath, 'wb+') as dest:
        for chunk in image_file.chunks():
            dest.write(chunk)

    # Store relative path in MongoDB
    image_url = f"/media/profile_images/{filename}"
    success, message, result = AuthService.update_user_profile(user_id, {'profile_image': image_url})

    if not success:
        return api_response(
            success=False,
            message="Image uploaded but failed to save path to profile.",
            errors={"db": message},
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

    return api_response(
        success=True,
        message="Profile image uploaded successfully.",
        data={"image_url": image_url, "user": result},
        status_code=status.HTTP_200_OK
    )

@api_view(['POST'])
def forgot_password_view(request):
    """
    POST /api/v1/auth/forgot-password/
    Takes 'email' and generates a reset link.
    """
    email = request.data.get('email')
    
    success, message, data = AuthService.forgot_password(email)
    
    if not success:
        return api_response(
            success=False,
            message=message,
            errors={"error": message},
            status_code=status.HTTP_400_BAD_REQUEST
        )
        
    return api_response(success=True, message=message, data=data, status_code=status.HTTP_200_OK)

@api_view(['POST'])
def reset_password_view(request):
    """
    POST /api/v1/auth/reset-password/
    Takes 'token' and 'new_password'.
    """
    token = request.data.get('token')
    new_password = request.data.get('new_password')
    
    success, message, _ = AuthService.reset_password(token, new_password)
    
    if not success:
        return api_response(
            success=False,
            message=message,
            errors={"error": message},
            status_code=status.HTTP_400_BAD_REQUEST
        )
        
    return api_response(success=True, message=message, data=None, status_code=status.HTTP_200_OK)
