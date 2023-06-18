import contextlib
from typing import AsyncIterator
from fastapi import Depends
from sqlalchemy import select, delete
from sqlalchemy.orm import as_declarative
from sqlalchemy.ext.asyncio import (
    AsyncConnection, AsyncEngine, AsyncSession,
    async_sessionmaker, create_async_engine)
from sqlalchemy.ext.declarative import declared_attr
from sqlalchemy.exc import NoResultFound
from uuid import uuid4

from .core.config import settings


@as_declarative()
class Base:

    @declared_attr
    def __tablename__(cls) -> str:
        return cls.__name__.lower()

    @classmethod
    def select(cls):
        return select(cls)

    @classmethod
    def delete(cls):
        return delete(cls)

    @classmethod
    async def create(cls, db: AsyncSession, id=None, **kwargs):
        transaction = cls(**kwargs)
        db.add(transaction)
        await db.commit()
        await db.refresh(transaction)
        return transaction

    @classmethod
    async def get(cls, db: AsyncSession, id: str):
        try:
            transaction = await db.get(cls, id)
        except NoResultFound:
            return None
        return transaction

    @classmethod
    async def get_all(cls, db: AsyncSession):
        return (await db.execute(select(cls))).scalars().unique().all()

    @classmethod
    async def update(cls, db: AsyncSession, id: str, **kwargs):
        transaction = await cls.get(db, id)
        if not transaction:
            return None

        for key, value in kwargs.items():
            if hasattr(transaction, key):
                setattr(transaction, key, value)

        await db.commit()
        await db.refresh(transaction)
        return transaction

class DatabaseSessionManager:
    def __init__(self):
        self._engine: AsyncEngine | None = None
        self._sessionmaker: async_sessionmaker | None = None

    def init(self, host: str):
        self._engine = create_async_engine(host)
        self._sessionmaker = async_sessionmaker(autocommit=False, bind=self._engine)

    async def close(self):
        if self._engine is None:
            raise Exception("DatabaseSessionManager is not initialized")
        await self._engine.dispose()
        self._engine = None
        self._sessionmaker = None

    @contextlib.asynccontextmanager
    async def connect(self) -> AsyncIterator[AsyncConnection]:
        if self._engine is None:
            raise Exception("DatabaseSessionManager is not initialized")

        async with self._engine.begin() as connection:
            try:
                yield connection
            except Exception:
                await connection.rollback()
                raise

    @contextlib.asynccontextmanager
    async def session(self) -> AsyncIterator[AsyncSession]:
        if self._sessionmaker is None:
            raise Exception("DatabaseSessionManager is not initialized")

        session = self._sessionmaker()
        try:
            yield session
        except Exception:
            await session.rollback()
            raise
        finally:
            await session.close()

    # Used for testing
    async def create_all(self, connection: AsyncConnection):
        await connection.run_sync(Base.metadata.create_all)

    async def drop_all(self, connection: AsyncConnection):
        await connection.run_sync(Base.metadata.drop_all)


sessionmanager = DatabaseSessionManager()


async def get_db():
    async with sessionmanager.session() as session:
        yield session