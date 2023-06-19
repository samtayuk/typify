from pydantic import BaseModel
from humps import camelize


class RawIngredientSchemaBase(BaseModel):
    name: str

    class Config:
        orm_mode = True
        alias_generator = camelize
        allow_population_by_field_name = True


class RawIngredientSchema(RawIngredientSchemaBase):
    id: str


class RawIngredientSchemaSuggest(RawIngredientSchemaBase):
    id: str
    suggestion: str
    confidence: float
    amount_left: int


class RawIngredientSchemaUpdate(BaseModel):
    ingredient_name: str

    class Config:
        orm_mode = True
        alias_generator = camelize
        allow_population_by_field_name = True


class IngredientSchemaBase(BaseModel):
    name: str

    class Config:
        orm_mode = True
        alias_generator = camelize
        allow_population_by_field_name = True

class MealIngredientSchema(IngredientSchemaBase):
    quantity: int
    unit: str


class IngredientSchema(IngredientSchemaBase):
    id: str

class IngredientSchemaCreate(IngredientSchemaBase):
    pass