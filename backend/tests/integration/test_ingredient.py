from house.models import Ingredient as IngredientModel

async def test_autocomplete_ingredient(db_session, client):
    await IngredientModel.create(db_session, name="red", bought_unit="g")
    await IngredientModel.create(db_session, name="green", bought_unit="ml")

    response = client.get("/api/v1/ingredients/autocomplete?ingredient=red")
    assert response.status_code == 200
    assert len(response.json()) == 1
    assert response.json()[0]["name"] == "red"
    assert response.json()[0]["boughtUnit"] == "g"
    # TODO: Add id to response