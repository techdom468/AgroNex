from django.contrib.auth.hashers import make_password, check_password
from api.repositories.user_repository import UserRepository
from api.utils.jwt_utils import generate_jwt
import uuid
import datetime

class AuthService:
    @staticmethod
    def register_user(email, password, full_name, role='farmer'):
        # Business logic for validation
        if not email or not password or not full_name:
            return False, "Please provide email, password, and full_name", None

        # Check if user exists
        existing_user = UserRepository.find_by_email(email)
        if existing_user:
            return False, "User with this email already exists", None

        # Hash password and create user
        hashed_password = make_password(password)
        user_data = {
            "email": email,
            "password_hash": hashed_password,
            "full_name": full_name,
            "role": role
        }
        
        user_id = UserRepository.create_user(user_data)
        if not user_id:
            return False, "Database connection not available", None
            
        token = generate_jwt(user_id, role)
        
        _, _, user_info = AuthService.get_user_profile(user_id)
        
        return True, "User registered successfully", {"token": token, "user": user_info}

    @staticmethod
    def login_user(email, password):
        if not email or not password:
            return False, "Please provide email and password", None
            
        user = UserRepository.find_by_email(email)
        if not user:
            return False, "Invalid email or password", None
            
        if not check_password(password, user['password_hash']):
            return False, "Invalid email or password", None
            
        token = generate_jwt(user['_id'], user.get('role', 'farmer'))
        
        _, _, user_info = AuthService.get_user_profile(user['_id'])
        
        return True, "Login successful", {"token": token, "user": user_info}

    @staticmethod
    def get_user_profile(user_id):
        user = UserRepository.find_by_id(user_id)
        if not user:
            return False, "User not found", None
            
        user_info = {
            "id": str(user['_id']),
            "email": user['email'],
            "full_name": user.get('full_name'),
            "role": user.get('role', 'farmer'),
            "state": user.get('state', ''),
            "district": user.get('district', ''),
            "main_crop": user.get('main_crop', ''),
            "farm_size": user.get('farm_size', ''),
            "mobile": user.get('mobile', ''),
            "soil_type": user.get('soil_type', ''),
            "profile_image": user.get('profile_image', ''),
            "created_at": user.get('created_at')
        }
        return True, "Profile fetched successfully", user_info

    @staticmethod
    def update_user_profile(user_id, profile_data):
        """
        Updates the farmer profile fields.
        """
        if not profile_data:
            return False, "No profile data provided", None

        # Filter allowed fields
        allowed = ['state', 'district', 'main_crop', 'farm_size', 'full_name',
                   'mobile', 'soil_type', 'profile_image']
        filtered = {k: v for k, v in profile_data.items() if k in allowed}

        success = UserRepository.update_profile(user_id, filtered)
        if not success:
            return False, "Failed to update profile", None

        # Return updated profile
        return AuthService.get_user_profile(user_id)

    @staticmethod
    def forgot_password(email):
        if not email:
            return False, "Please provide an email address", None
            
        user = UserRepository.find_by_email(email)
        if not user:
            # Return success even if user not found to prevent email enumeration
            return True, "If an account with that email exists, a reset link has been sent.", None
            
        token = str(uuid.uuid4())
        expiry = datetime.datetime.now(datetime.timezone.utc) + datetime.timedelta(hours=1)
        
        success = UserRepository.set_reset_token(user['_id'], token, expiry)
        if not success:
            return False, "Failed to generate reset token", None
            
        # Simulating email send for dev environment
        reset_link = f"http://localhost:5173/reset-password?token={token}"
        print("*"*50)
        print(f"PASSWORD RESET LINK FOR {email}:")
        print(reset_link)
        print("*"*50)
        
        return True, "If an account with that email exists, a reset link has been sent.", {"reset_link": reset_link}

    @staticmethod
    def reset_password(token, new_password):
        if not token or not new_password:
            return False, "Token and new password are required", None
            
        user = UserRepository.find_by_reset_token(token)
        if not user:
            return False, "Invalid or expired reset token", None
            
        hashed_password = make_password(new_password)
        success = UserRepository.update_password(user['_id'], hashed_password)
        
        if not success:
            return False, "Failed to reset password", None
            
        return True, "Password has been successfully reset", None
