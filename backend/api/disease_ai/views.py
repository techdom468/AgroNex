from rest_framework.decorators import api_view, parser_classes
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework import status
from api.utils.responses import api_response
from api.utils.decorators import jwt_required
from .services import DiseaseDetectionService

@api_view(['POST'])
@jwt_required
@parser_classes([MultiPartParser, FormParser])
def predict_disease_view(request):
    """
    Handles image upload, runs YOLOv8 inference, and saves to history.
    """
    user_id = request.user_payload.get('user_id')
    image_file = request.FILES.get('image')
    
    if not image_file:
        return api_response(success=False, message="No image provided.", status_code=status.HTTP_400_BAD_REQUEST)
        
    success, message, result = DiseaseDetectionService.process_image(user_id, image_file)
    
    if not success:
        return api_response(success=False, message=message, errors={'error': message}, status_code=status.HTTP_400_BAD_REQUEST)
        
    return api_response(success=True, message=message, data=result, status_code=status.HTTP_200_OK)


@api_view(['GET'])
@jwt_required
def get_prediction_history(request):
    """
    Retrieves the prediction history for the logged-in user.
    """
    user_id = request.user_payload.get('user_id')
    
    try:
        skip = int(request.GET.get('skip', 0))
        limit = int(request.GET.get('limit', 10))
    except ValueError:
        skip, limit = 0, 10
        
    success, message, result = DiseaseDetectionService.get_user_history(user_id, skip, limit)
    
    if not success:
        return api_response(success=False, message=message, errors={'error': message}, status_code=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
    return api_response(success=True, message=message, data=result, status_code=status.HTTP_200_OK)
