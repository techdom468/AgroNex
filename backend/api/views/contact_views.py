from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework import status
from api.database.mongo import get_db
from datetime import datetime

@api_view(['POST'])
@permission_classes([AllowAny])
def contact_submit(request):
    try:
        data = request.data
        
        name = data.get('name', '').strip()
        email = data.get('email', '').strip()
        phone = data.get('phone', '').strip()
        subject = data.get('subject', '').strip()
        message = data.get('message', '').strip()
        
        # Validation
        if not name or not email or not message:
            return Response({'error': 'Name, email, and message are required fields'}, status=status.HTTP_400_BAD_REQUEST)
        
        if len(message) > 2000:
            return Response({'error': 'Message length cannot exceed 2000 characters'}, status=status.HTTP_400_BAD_REQUEST)
            
        db = get_db()
        if db is None:
            return Response({'error': 'Database connection error'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
            
        contact_doc = {
            'name': name,
            'email': email,
            'phone': phone,
            'subject': subject,
            'message': message,
            'createdAt': datetime.utcnow(),
            'status': 'unread'
        }
        
        result = db.contact_messages.insert_one(contact_doc)
        
        if result.inserted_id:
            return Response({'message': 'Your message has been sent successfully!'}, status=status.HTTP_201_CREATED)
        else:
            return Response({'error': 'Failed to save message'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
            
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
