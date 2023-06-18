import typer
import asyncio
import pandas as pd
from rich.progress import track
from sqlalchemy import select
from ..core.config import settings
from ..models import RawIngredient as RawIngredientModel, Ingredient as IngredientModel
from ..database import sessionmanager


cli: typer.Typer = typer.Typer()

@cli.command(name="ingredients")
def import_ingredients(path: str):
    """
    Import CSV file.
    """
    async def main():
        df = pd.read_csv(path)

        sessionmanager.init(settings.DATABASE_URI)
        async with sessionmanager.session() as session:
            raw_ingredients = (await session.execute(select(RawIngredientModel.name))).scalars().all()
            df = df[~df.ingredients.isin(raw_ingredients)]
            rows = df["ingredients"].unique().tolist()

            for row in track(rows, description="Importing ingredients.", total=len(rows)):
                raw_ingredient = RawIngredientModel(name=row)
                session.add(raw_ingredient)

            await session.commit()
    asyncio.run(main())


@cli.command(name="labels")
def import_labels(path: str):
    """
    Import CSV file.
    """
    async def main():
        df = pd.read_csv(path)

        sessionmanager.init(settings.DATABASE_URI)
        async with sessionmanager.session() as session:
            ingredients = (await session.execute(select(IngredientModel.name))).scalars().all()
            df = df[~df.labels.isin(ingredients)]
            rows = df["labels"].unique().tolist()

            for row in track(rows, description="Importing labels.", total=len(rows)):
                ingredient = IngredientModel(name=row)
                session.add(ingredient)
            await session.commit()

    asyncio.run(main())