from fastapi import FastAPI, Depends, HTTPException
from fastapi.responses import RedirectResponse
from fastapi.middleware.cors import CORSMiddleware   # ✅ ADD THIS
from sqlalchemy.orm import Session
from datetime import datetime

from app.db import Base, engine, SessionLocal
from app.models.url import URL
from app.routers import urls

app = FastAPI()

# 🔥 ADD THIS BLOCK
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # for development
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

Base.metadata.create_all(bind=engine)
app.include_router(urls.router)


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@app.get("/r/{code}", include_in_schema=False)
def redirect_short_url(code: str, db: Session = Depends(get_db)):
    url = db.query(URL).filter(URL.short_code == code).first()

    if not url:
        raise HTTPException(status_code=404, detail="Short URL not found")

    if url.expires_at and url.expires_at < datetime.utcnow():
        raise HTTPException(status_code=410, detail="This link has expired")

    url.click_count = (url.click_count or 0) + 1
    db.commit()

    return RedirectResponse(url=url.long_url, status_code=302)