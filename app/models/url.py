from sqlalchemy import Column, Integer, String, Text, DateTime, func
from app.db import Base


class URL(Base):
    __tablename__ = "urls"

    id = Column(Integer, primary_key=True, index=True)
    short_code = Column(String(16), unique=True, index=True, nullable=True)
    long_url = Column(Text, nullable=False)
    click_count = Column(Integer, default=0)
    expires_at = Column(DateTime, nullable=True)
    created_at = Column(DateTime, server_default=func.now())