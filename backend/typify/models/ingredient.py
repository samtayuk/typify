from sqlalchemy import Column, String
from sqlalchemy.orm import relationship
import uuid

from ..database import Base


class Ingredient(Base):
    id = Column(String, primary_key=True, index=True, default=lambda: uuid.uuid4().hex)
    name = Column(String(256), nullable=False)
    raw_ingredient = relationship("RawIngredient", back_populates="ingredient")
