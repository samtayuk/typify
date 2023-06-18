from house.models import Meal as MealModel

def test_create_recipe(client):
    json_data = {
        "title": "test",
        "servings": 4,
        "ingredients": [
            {
                "quantity": 5,
                "name": "test",
                "unit": "g"
            },
            {
                "quantity": 10,
                "name": "test2",
                "unit": "ml"
            }
        ],
        "recipeUrl": "https://www.google.com",
        "notes": "test notes",
    }

    response = client.get("/api/v1/meals")
    assert response.status_code == 200
    assert response.json() == []

    response = client.post(
        "/api/v1/meals/create",
        json=json_data,
    )
    assert response.status_code == 200

    response = client.get(f"/api/v1/meals/{response.json().get('id')}")
    assert response.status_code == 200
    assert response.json() == {
        "id": response.json().get("id"),
        **json_data
    }

    response = client.get("/api/v1/meals")
    assert response.status_code == 200
    assert len(response.json()) == 1

async def test_list_recipes(db_session, client):
    await MealModel.create(db_session, title="test", servings=4)
    await MealModel.create(db_session, title="test 2", servings=4)

    response = client.get("/api/v1/meals")
    assert response.status_code == 200
    assert len(response.json()) == 2


