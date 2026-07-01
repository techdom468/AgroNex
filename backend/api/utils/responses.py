from rest_framework.response import Response
from rest_framework import status

def api_response(success=True, message="", data=None, errors=None, status_code=status.HTTP_200_OK):
    """
    Standardized API response format for all endpoints.
    
    Format:
    {
        "status": "success" | "error",
        "message": "...",
        "data": { ... } | [],
        "errors": { ... } | [] | null
    }
    """
    return Response({
        "status": "success" if success else "error",
        "message": message,
        "data": data if data is not None else {},
        "errors": errors if errors is not None else None
    }, status=status_code)
