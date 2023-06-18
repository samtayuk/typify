import os
from alembic.config import Config
from .core.config import settings

def get_alembic_config() -> Config:
    """Get alembic config."""
    alembic_cfg = Config(os.path.join(settings.BASE_PATH, "migrations", "alembic.ini"))
    alembic_cfg.set_main_option("script_location", os.path.join(settings.BASE_PATH, "migrations"))
    return alembic_cfg