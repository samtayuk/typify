from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from alembic import command

from .database import sessionmanager
from .core.config import settings
from .utils import get_alembic_config
from .api.api_v1.api import api_router
from .ml_models.ingredient_classifier import ingredient_classifier



def init_app(init_db: bool = True):
    lifespan = None

    if init_db:
        sessionmanager.init(settings.DATABASE_URI)

        @asynccontextmanager
        async def lifespan(app: FastAPI):
            yield
            if sessionmanager._engine is not None:
                await sessionmanager.close()

    ingredient_classifier.init(settings.MODEL_PATH)

    _app = FastAPI(title=settings.PROJECT_NAME, debug=settings.DEBUG, lifespan=lifespan)

    _app.add_middleware(
        CORSMiddleware,
        allow_origins=[str(origin) for origin in settings.BACKEND_CORS_ORIGINS],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    _app.include_router(api_router, prefix=settings.API_V1_STR)

    return _app


app = init_app()
