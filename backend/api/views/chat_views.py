from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework import status
from datetime import datetime
from bson.objectid import ObjectId

from api.database.mongo import chat_collection
from api.ai_models.router import route_question

@api_view(['POST'])
@permission_classes([AllowAny]) # Change to IsAuthenticated if JWT is strictly required for chat
def chat_with_ai(request):
    question = request.data.get('question')
    session_id = request.data.get('sessionId', 'default-session')
    
    # In a real setup, get user id from JWT: request.user.id
    # For now, allow anonymous or get from request if provided
    user_id = str(request.user.id) if request.user and request.user.is_authenticated else request.data.get('userId', 'anonymous')

    if not question:
        return Response({'error': 'Question is required'}, status=status.HTTP_400_BAD_REQUEST)

    # 1. Route Question & Get Answer
    ai_response = route_question(question)
    
    # 2. Save to MongoDB
    chat_doc = {
        "userId": user_id,
        "sessionId": session_id,
        "question": question,
        "answer": ai_response['answer'],
        "intent": ai_response['intent'],
        "source": ai_response['source'],
        "confidence": ai_response.get('confidence', 0),
        "createdAt": datetime.utcnow()
    }
    
    if chat_collection is not None:
        try:
            chat_collection.insert_one(chat_doc)
            # Remove _id for JSON serialization
            chat_doc['_id'] = str(chat_doc['_id'])
        except Exception as e:
            print("Failed to save chat to MongoDB:", e)

    return Response(chat_doc, status=status.HTTP_200_OK)


@api_view(['GET'])
@permission_classes([AllowAny]) # Change to IsAuthenticated if needed
def get_chat_history(request):
    user_id = str(request.user.id) if request.user and request.user.is_authenticated else request.query_params.get('userId', 'anonymous')
    session_id = request.query_params.get('sessionId', 'default-session')
    
    if chat_collection is not None:
        history = list(chat_collection.find({"userId": user_id, "sessionId": session_id}).sort("createdAt", 1))
        # Convert ObjectId to string
        for doc in history:
            doc['_id'] = str(doc['_id'])
        return Response(history, status=status.HTTP_200_OK)
    else:
        return Response([], status=status.HTTP_200_OK)


@api_view(['DELETE'])
@permission_classes([AllowAny])
def delete_chat_history(request):
    user_id = str(request.user.id) if request.user and request.user.is_authenticated else request.query_params.get('userId', 'anonymous')
    session_id = request.query_params.get('sessionId', 'default-session')

    if chat_collection is not None:
        try:
            result = chat_collection.delete_many({"userId": user_id, "sessionId": session_id})
            return Response({"message": f"Deleted {result.deleted_count} messages"}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"message": "Cleared locally (DB error)", "error": str(e)}, status=status.HTTP_200_OK)
    else:
        # MongoDB not connected — chat was session-only, return success so frontend clears
        return Response({"message": "Cleared locally (MongoDB not connected)"}, status=status.HTTP_200_OK)
