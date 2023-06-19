from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from  sqlalchemy.sql.expression import func, select
from random import randint

from ....schemas import IngredientSchema, RawIngredientSchema, RawIngredientSchemaUpdate, RawIngredientSchemaSuggest
from ....database import get_db
from ....models import Ingredient as IngredientModel, RawIngredient as RawIngredientModel
from ....ml_models.ingredient_classifier import get_IClassifier

router = APIRouter()


@router.get("/next", response_model=RawIngredientSchemaSuggest)
async def raw_ingredients_next(db: AsyncSession = Depends(get_db), ingredient_classifier = Depends(get_IClassifier)):
    raw_ingredient = (await db.execute(RawIngredientModel.select().where(
        RawIngredientModel.ingredient_id == None).limit(250).order_by(func.random()))).scalars().first()

    amount_left = (await db.execute(select(func.count(RawIngredientModel.id)).select_from(RawIngredientModel).where(RawIngredientModel.ingredient_id == None))).scalars().first()
    print(amount_left)

    prediction = ingredient_classifier.predict([raw_ingredient.name])

    return {
        **raw_ingredient.__dict__,
        "suggestion": prediction[0][0].decode("utf-8"),
        "confidence": f"{prediction[1][0] * 100:.2f}",
        "amount_left": amount_left,
    }


@router.put("/{id}/update", response_model=RawIngredientSchema)
async def raw_ingredients_update(id: str, request_data: RawIngredientSchemaUpdate, db: AsyncSession = Depends(get_db)):
    raw_ingredient = await RawIngredientModel.get(db, id)

    ingredient = (await db.execute(IngredientModel.select().where(IngredientModel.name == request_data.ingredient_name))).scalars().first()

    if ingredient is None:
        ingredient = await IngredientModel.create(db, name=request_data.ingredient_name)

    raw_ingredient.ingredient_id = ingredient.id

    await db.commit()
    await db.refresh(raw_ingredient)
    return raw_ingredient