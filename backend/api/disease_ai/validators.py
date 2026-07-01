import os
from PIL import Image

def validate_image(image_file):
    """
    Validates the uploaded image for size, format, and corruption.
    """
    if not image_file:
        return False, "No image uploaded."
        
    # Check file size (max 5MB)
    if image_file.size > 5 * 1024 * 1024:
        return False, "Image size exceeds 5MB."
        
    # Check extension
    ext = os.path.splitext(image_file.name)[1].lower()
    if ext not in ['.jpg', '.jpeg', '.png']:
        return False, "Invalid image format. Only JPG, JPEG, and PNG are allowed."
        
    # Verify image is not corrupted using Pillow
    try:
        img = Image.open(image_file)
        img.verify() # Verify that it is, in fact, an image
        
        # Optionally, check resolution if needed
        # width, height = img.size
        # if width < 100 or height < 100:
        #    return False, "Image resolution too low."
            
    except Exception as e:
        return False, f"Invalid or corrupted image file. {str(e)}"
        
    # Rewind file pointer after reading with Pillow
    image_file.seek(0)
    
    return True, "Image is valid."
