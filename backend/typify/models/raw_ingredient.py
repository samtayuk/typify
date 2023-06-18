from sqlalchemy import Column, String, ForeignKey
from sqlalchemy.orm import relationship
import uuid

from ..database import Base


class RawIngredient(Base):
    id = Column(String, primary_key=True, index=True, default=lambda: uuid.uuid4().hex)
    name = Column(String(256), nullable=False)
    ingredient_id = Column(String, ForeignKey("ingredient.id"))
    ingredient = relationship("Ingredient", back_populates="raw_ingredient", lazy="joined")

    def __repr__(self):
        return f"<RawIngredient(id={self.id}, name={self.name}, ingredient_id={self.ingredient_id})>"
