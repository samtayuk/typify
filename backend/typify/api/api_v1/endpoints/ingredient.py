import re
from fastapi import APIRouter, Depends
from sqlalchemy import or_
from sqlalchemy.ext.asyncio import AsyncSession

from ....schemas import IngredientSchema
from ....database import get_db
from ....models import Ingredient as IngredientModel

router = APIRouter()

@router.get("/autocomplete", response_model=list[IngredientSchema])
async def ingredients_autocomplete(ingredient: str, db: AsyncSession = Depends(get_db)):
    if ingredient == "":
        return []
    ingredient = re.sub(r"[-()\"#/@;:<>{}`+=~|.!?&*%$£^,]", "", ingredient.lower()).split()
    query = IngredientModel.select().where(or_(*[IngredientModel.name.match(f"%{word}%") for word in ingredient])).limit(4)
    return (await db.execute(query)).scalars().all()
