
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from datetime import datetime
import os

from app.db import SessionLocal
from app.models.url import URL
from app.services.shortener import encode_base62
from app.schemas.url import (
    CreateShortUrlRequest,
    CreateShortUrlResponse,
    UrlStatsResponse
)

router = APIRouter(prefix="/urls", tags=["urls"])

# 🔧 Better: configurable base URL
BASE_URL = os.getenv("BASE_URL", "http://127.0.0.1:8000")


# 🔧 Keep this for now (later move to app/depend/)
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.post("/", response_model=CreateShortUrlResponse)
def create_short_url(
    payload: CreateShortUrlRequest,
    db: Session = Depends(get_db)
):
    # ✅ Create DB entry first
    url = URL(
        long_url=str(payload.long_url),
        expires_at=payload.expires_at
    )
    db.add(url)
    db.commit()
    db.refresh(url)

    # ✅ Generate short code
    short_code = encode_base62(url.id)

    # (Optional safety check - future-proof)
    existing = db.query(URL).filter(URL.short_code == short_code).first()
    if existing:
        raise HTTPException(status_code=500, detail="Collision detected")

    url.short_code = short_code
    db.commit()

    return CreateShortUrlResponse(
        short_url=f"{BASE_URL}/r/{short_code}",
        long_url=payload.long_url
    )


@router.get("/{code}", response_model=UrlStatsResponse)
def get_stats(
    code: str,
    db: Session = Depends(get_db)
):
    url = db.query(URL).filter(URL.short_code == code).first()

    if not url:
        raise HTTPException(status_code=404, detail="Not found")

    # ✅ Expiry check (important)
    if url.expires_at and url.expires_at < datetime.utcnow():
        raise HTTPException(status_code=410, detail="Link expired")

    return UrlStatsResponse(
        short_code=url.short_code,
        long_url=url.long_url,
        click_count=url.click_count,
        created_at=url.created_at,
        expires_at=url.expires_at
    )