import asyncio
from contextlib import ExitStack

import pytest
from fastapi.testclient import TestClient
from sqlalchemy.testing.entities import ComparableEntity

from house.main import init_app
from house.models import *
from house.database import get_db, sessionmanager

print("conftest.py")


@pytest.fixture(autouse=True)
def app():
    with ExitStack():
        yield init_app(init_db=False)


@pytest.fixture
def client(app):
    with TestClient(app) as c:
        yield c


@pytest.fixture(scope="session")
def event_loop(request):
    loop = asyncio.get_event_loop_policy().new_event_loop()
    yield loop
    loop.close()


@pytest.fixture(scope="session", autouse=True)
async def connection_test(event_loop):
    connection_str = f"sqlite+aiosqlite:///././test.db"
    sessionmanager.init(connection_str)
    yield
    await sessionmanager.close()


@pytest.fixture(scope="function", autouse=True)
async def create_tables(connection_test):
    async with sessionmanager.connect() as connection:
        await sessionmanager.drop_all(connection)
        await sessionmanager.create_all(connection)


@pytest.fixture(scope="session")
async def db_session():
    async with sessionmanager.session() as session:
            yield session


@pytest.fixture(scope="function", autouse=True)
async def session_override(app, connection_test):
    async def get_db_override():
        async with sessionmanager.session() as session:
            yield session

    app.dependency_overrides[get_db] = get_db_override

