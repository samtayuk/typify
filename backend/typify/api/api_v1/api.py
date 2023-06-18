from fastapi import APIRouter

from .endpoints import ingredient
from .endpoints import raw_ingredient
from .endpoints import file

api_router = APIRouter()
api_router.include_router(ingredient.router, prefix="/ingredients", tags=["ingredient"])
api_router.include_router(raw_ingredient.router, prefix="/raw-ingredients", tags=["raw-ingredient"])
api_router.include_router(file.router, prefix="/file", tags=["file"])

