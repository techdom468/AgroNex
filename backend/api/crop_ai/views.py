from rest_framework.decorators import api_view
from rest_framework import status
from api.services.crop_service import CropService
from api.utils.responses import api_response
from api.utils.decorators import jwt_required

@api_view(['POST'])
@jwt_required
def predict_crop_view(request):
    """
    Predict the best crop based on soil and weather parameters.
    """
    data = request.data
    
    try:
        n = float(data.get('nitrogen', 0))
        p = float(data.get('phosphorus', 0))
        k = float(data.get('potassium', 0))
        temp = float(data.get('temperature', 0))
        hum = float(data.get('humidity', 0))
        ph = float(data.get('ph', 0))
        rain = float(data.get('rainfall', 0))
    except (ValueError, TypeError):
        return api_response(success=False, message="Invalid input parameters. All inputs must be numeric.", status_code=status.HTTP_400_BAD_REQUEST)
        
    success, message, result = CropService.predict_crop(n, p, k, temp, hum, ph, rain)
    
    if not success:
        return api_response(success=False, message=message, errors={"error": message}, status_code=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
    return api_response(success=True, message=message, data=result, status_code=status.HTTP_200_OK)
