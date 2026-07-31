import datetime

def parse_arrival_date(date_str):
    """
    Parses Government API date format (DD/MM/YYYY) to Python datetime.date
    If parsing fails, returns today's date.
    """
    try:
        # Gov API usually sends dates in DD/MM/YYYY format
        return datetime.datetime.strptime(date_str, "%d/%m/%Y")
    except ValueError:
        return datetime.datetime.now()

def serialize_mongo_doc(doc):
    """
    Convert MongoDB document containing ObjectId and datetime to JSON-serializable format.
    """
    if not doc:
        return doc
    
    if '_id' in doc:
        doc['id'] = str(doc['_id'])
        del doc['_id']
        
    for key, value in doc.items():
        if isinstance(value, datetime.datetime):
            doc[key] = value.isoformat()
            
    return doc
