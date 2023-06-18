import os
import typer
from typing_extensions import Annotated
from alembic.config import Config
from alembic import command
from ..core.config import settings
from ..utils import get_alembic_config


cli: typer.Typer = typer.Typer()

@cli.command(name="upgrade")
def db_upgrade(revision: Annotated[str, typer.Argument()] = "head"):
    """Upgrade database."""
    command.upgrade(get_alembic_config(), revision)


@cli.command(name="downgrade")
def db_downgrade(revision: Annotated[str, typer.Argument()] = "-1"):
    """Downgrade database."""
    command.downgrade(get_alembic_config(), revision)


@cli.command(name="revision")
def db_revision(message: Annotated[str, typer.Option("-m", "--message", help="Message for revision", prompt=True)]):
    """Create a new revision."""
    command.revision(get_alembic_config(), autogenerate=True, message=message)
