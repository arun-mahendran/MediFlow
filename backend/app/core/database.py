from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker

from app.core.config import settings

# Force every database session to UTC. The app stores times as UTC; without
# this, a database set to local time (e.g. Asia/Kolkata) shifts them by hours.
_connect_args = {"options": "-c timezone=UTC"} if settings.DATABASE_URL.startswith("postgres") else {}
engine = create_engine(settings.DATABASE_URL, pool_pre_ping=True, connect_args=_connect_args)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
