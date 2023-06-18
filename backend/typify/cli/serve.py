import uvicorn

from .main import cli
from .. import main as app
from ..core.config import settings


@cli.command()
def serve():
    uvicorn.run(
        f"{app.__name__}:app",
        host=settings.HOST,
        port=settings.PORT,
        log_level="info",
        reload=settings.DEBUG,
        workers=settings.WORKERS)