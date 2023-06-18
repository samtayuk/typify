import re
import nltk
from nltk.corpus import stopwords
import pandas as pd
import numpy as np
import tensorflow as tf
from typing import Any, List


class IngredientClassifierPredictor:
    """
    Class to predict ingredient categories using a trained model.
    """

    def __init__(self) -> None:
        """
        Initialize the IngredientClassifierPredictor.

        Args:
            model_path (str): Path to the saved model.
        """
        nltk.download("stopwords", quiet=True)
        self.stop_words: List[str] = stopwords.words("english")
        self.common_words: List[str] = [
            "cup", "tsp", "tbsp", "oz", "lb", "g", "kg", "ml",
            "l", "teaspoon", "tablespoon", "ounce", "pound",
            "gram", "kilogram", "milliliter", "liter", "pinch", "fresh"
        ]

    def init(self, model_path: str):
        self.model = tf.keras.models.load_model(model_path)

    def _clean_text(self, text: str) -> str:
        """
        Clean the input text.

        Args:
            text (str): Input text.

        Returns:
            str: Cleaned text.
        """
        text = text.lower()
        text = re.sub(r"[^a-zA-Z0-9]", " ", text)
        text = " ".join([word for word in text.split(
        ) if word not in self.stop_words and word not in self.common_words])
        return text

    def predict(self, ingredients: List[str]) -> str:
        """
        Predict the categories of ingredients.

        Args:
            ingredients (List[str]): List of ingredient descriptions.

        Returns:
            str: Predicted category.
        """
        return self.model.predict(tf.constant([
            self._clean_text(i) for i in ingredients]))


ingredient_classifier = IngredientClassifierPredictor()


async def get_IClassifier():
    return ingredient_classifier
