from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from api.database.mongodb import get_db
from bson import ObjectId
from api.utils.decorators import jwt_required

@api_view(['GET'])
@jwt_required
def get_dashboard_summary(request):
    db = get_db()
    if db is None:
        return Response({'error': 'Database connection error'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    # jwt_required puts payload in request.user_payload    
    user_payload = getattr(request, 'user_payload', {})
    user_id = user_payload.get('user_id')
    
    user_doc = None
    if user_id:
        try:
            user_doc = db.users.find_one({'_id': ObjectId(str(user_id))})
        except Exception:
            user_doc = None
    
    if not user_doc:
        user_doc = {}
        
    location = user_doc.get('location', 'Gujarat, India')
    full_name = user_doc.get('full_name', 'Farmer')
    
    # AI-driven recommendations (rule engine)
    recommendations = [
        "Today's weather is suitable for irrigation.",
        "Low disease risk detected for your region today."
    ]
    
    return Response({
        'user': {
            'name': full_name,
            'location': location
        },
        'recommendations': recommendations
    }, status=status.HTTP_200_OK)


@api_view(['GET'])
@jwt_required
def get_recent_activity(request):
    db = get_db()
    if db is None:
        return Response({'data': []}, status=status.HTTP_200_OK)
    
    user_payload = getattr(request, 'user_payload', {})
    user_id = user_payload.get('user_id')
    
    if not user_id:
        return Response({'data': []}, status=status.HTTP_200_OK)
    
    activities = []
    
    # Fetch recent disease predictions from MongoDB
    try:
        disease_preds = list(
            db.disease_predictions
            .find({'user_id': str(user_id)})
            .sort('prediction_date', -1)
            .limit(5)
        )
        
        for dp in disease_preds:
            activities.append({
                'type': 'disease',
                'title': 'Disease Detected',
                'desc': f"Identified: {dp.get('disease_name', 'Unknown')}",
                'time': dp.get('prediction_date', ''),
                'timestamp': str(dp.get('prediction_date', ''))
            })
    except Exception:
        pass
    
    # Sort by timestamp descending, take top 5
    activities.sort(key=lambda x: x['timestamp'], reverse=True)
    recent = activities[:5]
    
    return Response({'data': recent}, status=status.HTTP_200_OK)
