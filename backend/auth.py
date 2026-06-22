from fastapi import HTTPException, Security, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from google.oauth2 import id_token
from google.auth.transport import requests
import os
from typing import Optional

security = HTTPBearer(auto_error=False)

def verify_google_token(credentials: Optional[HTTPAuthorizationCredentials] = Security(security)):
    if not credentials:
        return None
    token = credentials.credentials
    try:
        # During local development, if client_id is not enforced, you can omit it.
        # However, google id_token.verify_oauth2_token expects a client ID.
        # We can try to decode it safely or use the google library
        client_id = os.getenv("GOOGLE_CLIENT_ID")
        idinfo = id_token.verify_oauth2_token(token, requests.Request(), client_id, clock_skew_in_seconds=10)
        return idinfo
    except ValueError as e:
        return None

