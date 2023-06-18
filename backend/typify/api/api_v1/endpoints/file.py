import csv
from io import StringIO
from datetime import datetime
from fastapi import APIRouter, Depends
from fastapi.responses import PlainTextResponse
from sqlalchemy.ext.asyncio import AsyncSession

from ....database import get_db
from ....models import RawIngredient as RawIngredientModel

router = APIRouter()


@router.get("/export")
async def export(db: AsyncSession = Depends(get_db)):
    file_date = datetime.now().strftime("%Y-%m-%d_%H-%M-%S")
    raw_ingredient = (await db.execute(RawIngredientModel.select())).scalars().all()

    csv_file = StringIO()
    csv_writer = csv.writer(csv_file, delimiter=',', quotechar='"', quoting=csv.QUOTE_MINIMAL)
    csv_writer.writerow(["name", "ingredient"])

    for row in raw_ingredient:
        ingredient_name = ""
        if row.ingredient is not None:
            ingredient_name = row.ingredient.name

        csv_writer.writerow([row.name, ingredient_name])

    return PlainTextResponse(csv_file.getvalue(), media_type="text/csv", headers={"Content-Disposition": f"attachment; filename=export_{file_date}.csv"})
