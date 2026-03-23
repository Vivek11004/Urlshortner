from pydantic import BaseModel, HttpUrl
from typing import Optional
from datetime import datetime

class CreateShortUrlRequest(BaseModel):
    long_url: HttpUrl
    expires_at: Optional[datetime] = None

class CreateShortUrlResponse(BaseModel):
    short_url: str
    long_url: HttpUrl

class UrlStatsResponse(BaseModel):
    short_code: str
    long_url: HttpUrl
    click_count: int
    created_at: datetime
    expires_at: Optional[datetime]