from django.contrib.auth.hashers import make_password, check_password
from api.repositories.user_repository import UserRepository
from api.utils.jwt_utils import generate_jwt

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
        
        user_info = {
            "id": str(user_id),
            "email": email,
            "full_name": full_name,
            "role": role
        }
        
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
        
        user_info = {
            "id": str(user['_id']),
            "email": user['email'],
            "full_name": user.get('full_name'),
            "role": user.get('role', 'farmer')
        }
        
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
            "created_at": user.get('created_at')
        }
        return True, "Profile fetched successfully", user_info
