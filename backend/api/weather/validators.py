def validate_coordinates(lat, lon):
    try:
        lat = float(lat)
        lon = float(lon)
    except (TypeError, ValueError):
        return False, "Latitude and longitude must be valid numbers"
    
    if not (-90 <= lat <= 90):
        return False, "Latitude must be between -90 and 90"
    
    if not (-180 <= lon <= 180):
        return False, "Longitude must be between -180 and 180"
        
    return True, (lat, lon)
