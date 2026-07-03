from rest_framework import serializers

class MarketFilterSerializer(serializers.Serializer):
    crop = serializers.CharField(max_length=100, required=False)
    state = serializers.CharField(max_length=100, required=False)
    district = serializers.CharField(max_length=100, required=False)
    market = serializers.CharField(max_length=100, required=False)

class MarketHistorySerializer(serializers.Serializer):
    crop = serializers.CharField(max_length=100, required=True)
    days = serializers.IntegerField(min_value=1, max_value=365, default=30)

class MarketPredictSerializer(serializers.Serializer):
    crop = serializers.CharField(max_length=100, required=True)
