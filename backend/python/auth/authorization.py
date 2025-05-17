import os
import jwt
from flask import request
from dotenv import load_dotenv

load_dotenv() 

JWT_SECRET = os.getenv("JWT_SECRET")

def verify_jwt():
    token = request.cookies.get("token")
    if not token:
        return False, "Missing token"

    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=["HS256"])
        return True, payload 
    except jwt.ExpiredSignatureError:
        return False, "Token expired"
    except jwt.InvalidTokenError:
        return False, "Invalid token"
