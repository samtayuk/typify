import pathlib
import os
from typing import Any, Dict, List, Optional, Union
from pydantic import AnyHttpUrl, BaseSettings, validator, DirectoryPath


# Project Directories
ROOT = pathlib.Path(__file__).resolve().parent.parent


class Settings(BaseSettings):
    PROJECT_NAME: str = "House"
    DATABASE_URI: str = "sqlite+aiosqlite:///././catr.db"
    API_V1_STR: str = "/api/v1"
    BASE_PATH: DirectoryPath = ROOT
    DEBUG: bool = True
    HOST: str = "0.0.0.0"
    PORT: int = 5000
    WORKERS: int = 1
    AUTO_UPGRADE_DB: bool = False
    BACKEND_CORS_ORIGINS: List[str] = [
        "http://localhost:3000",
        "https://localhost:8000",
        "http://localhost:5000",
        "http://localhost:5173",
        "http://localhost",
        "https://localhost"
    ]
    MODEL_PATH: str = str(os.path.join(ROOT, "ml_models/ingredient-classifier/1"))

    @validator("BACKEND_CORS_ORIGINS", pre=True)
    def assemble_cors_origins(cls, v: Union[str, List[str]]) -> Union[List[str], str]:
        if isinstance(v, str) and not v.startswith("["):
            return [i.strip() for i in v.split(",")]
        elif isinstance(v, (list, str)):
            return v
        raise ValueError(v)

    class Config:
        case_sensitive = True
        env_file = ".env"


class ProductionSettings(Settings):
    DEBUG: bool = False
    HOST: str = "0.0.0.0"
    PORT: int = 10000
    WORKERS: int = 4
    BACKEND_CORS_ORIGINS: List[str] = ["https://typify.onrender.com", "*"]
    DATABASE_URI: str = "postgresql+asyncpg://{DB_USER}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/{DB_NAME}".format(
        DB_USER=os.getenv("DB_USER"),
        DB_PASSWORD=os.getenv("DB_PASSWORD"),
        DB_HOST=os.getenv("DB_HOST"),
        DB_PORT=os.getenv("DB_PORT"),
        DB_NAME=os.getenv("DB_NAME"),
    )

settingsDict = {
    "devlopment": Settings,
    "production": ProductionSettings,
}

settings = settingsDict[os.getenv("APP_ENVIRONMENT", "devlopment")]()