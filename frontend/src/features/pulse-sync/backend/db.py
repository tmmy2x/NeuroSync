from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy import Column, String
from sqlalchemy.future import select
from sqlalchemy.orm import sessionmaker
from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine
from sqlalchemy import Column, Text, DateTime
from datetime import datetime

Base = declarative_base()
engine = create_async_engine("sqlite+aiosqlite:///./users.db")
SessionLocal = sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)

class UserSession(Base):
    __tablename__ = "user_sessions"
    user_id = Column(String, primary_key=True)
    token_json = Column(String)  # store token as JSON string

class CoachSession(Base):
    __tablename__ = "coach_sessions"
    id = Column(String, primary_key=True)
    timestamp = Column(DateTime, default=datetime.utcnow)
    summary = Column(Text)
    habit = Column(Text)
    check_in = Column(Text)

async def init_db():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
