"""
Database Configuration & Connection Management

Sets up PostgreSQL connection with PostGIS support, handles migrations,
and provides session management for ORM operations.
"""

import os
import logging
from typing import Generator
from sqlalchemy import create_engine, event, text
from sqlalchemy.orm import sessionmaker, Session
from sqlalchemy.pool import QueuePool
from alembic.config import Config
from alembic.command import upgrade, downgrade, init, revision, current
import asyncio

logger = logging.getLogger(__name__)

# ============ DATABASE CONFIGURATION ============

class DatabaseConfig:
    """Database configuration from environment variables"""

    def __init__(self):
        # PostgreSQL connection details
        self.db_host = os.getenv('DB_HOST', 'localhost')
        self.db_port = int(os.getenv('DB_PORT', 5432))
        self.db_user = os.getenv('DB_USER', 'postgres')
        self.db_password = os.getenv('DB_PASSWORD', 'postgres')
        self.db_name = os.getenv('DB_NAME', 'borehole_ai')

        # Connection pool settings
        self.pool_size = int(os.getenv('DB_POOL_SIZE', 10))
        self.max_overflow = int(os.getenv('DB_MAX_OVERFLOW', 20))
        self.pool_recycle = int(os.getenv('DB_POOL_RECYCLE', 3600))
        self.pool_pre_ping = os.getenv('DB_POOL_PRE_PING', 'true').lower() == 'true'

        # PostGIS settings
        self.enable_postgis = os.getenv('ENABLE_POSTGIS', 'true').lower() == 'true'

        # Logging
        self.echo_sql = os.getenv('DB_ECHO_SQL', 'false').lower() == 'true'

    @property
    def sqlalchemy_url(self) -> str:
        """Generate SQLAlchemy connection string"""
        return (
            f"postgresql://{self.db_user}:{self.db_password}@"
            f"{self.db_host}:{self.db_port}/{self.db_name}"
        )

    def __repr__(self):
        return f"DatabaseConfig(host={self.db_host}, port={self.db_port}, name={self.db_name})"


# ============ ENGINE & SESSION MANAGEMENT ============

class DatabaseManager:
    """Manages database engine and sessions"""

    def __init__(self, config: DatabaseConfig = None):
        self.config = config or DatabaseConfig()
        self.engine = None
        self.SessionLocal = None
        self._initialize()

    def _initialize(self):
        """Initialize database engine and session factory"""
        try:
            logger.info(f"Initializing database: {self.config}")

            # Create engine with connection pooling
            self.engine = create_engine(
                self.config.sqlalchemy_url,
                poolclass=QueuePool,
                pool_size=self.config.pool_size,
                max_overflow=self.config.max_overflow,
                pool_recycle=self.config.pool_recycle,
                pool_pre_ping=self.config.pool_pre_ping,
                echo=self.config.echo_sql,
                future=True  # Use SQLAlchemy 2.0 style
            )

            # Create session factory
            self.SessionLocal = sessionmaker(
                bind=self.engine,
                class_=Session,
                expire_on_commit=False
            )

            # Setup event listeners
            self._setup_connection_events()

            logger.info("Database initialization successful")

        except Exception as e:
            logger.error(f"Database initialization failed: {e}")
            raise

    def _setup_connection_events(self):
        """Setup connection event listeners"""
        @event.listens_for(self.engine, "connect")
        def receive_connect(dbapi_conn, connection_record):
            """Enable PostGIS on each connection"""
            if self.config.enable_postgis:
                try:
                    cursor = dbapi_conn.cursor()
                    cursor.execute("CREATE EXTENSION IF NOT EXISTS postgis;")
                    cursor.execute("CREATE EXTENSION IF NOT EXISTS postgis_topology;")
                    dbapi_conn.commit()
                    cursor.close()
                    logger.debug("PostGIS extensions enabled")
                except Exception as e:
                    logger.warning(f"PostGIS setup failed: {e}")

    def get_session(self) -> Session:
        """Get a new database session"""
        return self.SessionLocal()

    def get_session_generator(self) -> Generator[Session, None, None]:
        """Dependency injection generator for FastAPI"""
        session = self.SessionLocal()
        try:
            yield session
        finally:
            session.close()

    def health_check(self) -> bool:
        """Test database connection"""
        try:
            with self.engine.connect() as connection:
                connection.execute(text("SELECT 1"))
                logger.info("Database health check: OK")
                return True
        except Exception as e:
            logger.error(f"Database health check failed: {e}")
            return False

    def test_postgis(self) -> bool:
        """Test PostGIS availability"""
        try:
            with self.engine.connect() as connection:
                result = connection.execute(text("SELECT PostGIS_version();"))
                version = result.scalar()
                logger.info(f"PostGIS version: {version}")
                return True
        except Exception as e:
            logger.warning(f"PostGIS test failed: {e}")
            return False


# ============ ALEMBIC MIGRATIONS ============

class MigrationManager:
    """Manages database schema migrations"""

    def __init__(self, alembic_ini_path: str = 'alembic.ini'):
        self.alembic_config = Config(alembic_ini_path)

    def initialize_migrations(self, base_path: str = '.'):
        """Initialize Alembic in project"""
        try:
            init(self.alembic_config, base_path)
            logger.info("Alembic migration directory initialized")
        except Exception as e:
            logger.error(f"Alembic initialization failed: {e}")
            raise

    def create_migration(self, message: str, autogenerate: bool = True):
        """Create a new migration"""
        try:
            revision(
                self.alembic_config,
                message=message,
                autogenerate=autogenerate
            )
            logger.info(f"Migration created: {message}")
        except Exception as e:
            logger.error(f"Migration creation failed: {e}")
            raise

    def get_current_revision(self) -> str:
        """Get current database schema revision"""
        try:
            result = current(self.alembic_config)
            return result
        except Exception as e:
            logger.error(f"Failed to get current revision: {e}")
            return "unknown"

    def upgrade_to_head(self, sql: bool = False):
        """Upgrade database to latest schema"""
        try:
            upgrade(self.alembic_config, 'head', sql=sql)
            logger.info("Database upgraded to latest schema")
        except Exception as e:
            logger.error(f"Database upgrade failed: {e}")
            raise

    def downgrade_to_revision(self, revision: str):
        """Downgrade database to specific revision"""
        try:
            downgrade(self.alembic_config, revision)
            logger.info(f"Database downgraded to: {revision}")
        except Exception as e:
            logger.error(f"Database downgrade failed: {e}")
            raise


# ============ INITIALIZATION ============

# Global instances
config = DatabaseConfig()
db_manager = DatabaseManager(config)
migration_manager = MigrationManager()


def get_db() -> Generator[Session, None, None]:
    """FastAPI dependency for database session"""
    return db_manager.get_session_generator()


def init_db():
    """Initialize database (create tables)"""
    try:
        from app.database.models import Base  # Import all models

        logger.info("Creating database tables...")
        Base.metadata.create_all(bind=db_manager.engine)
        logger.info("Database tables created successfully")

        # Run migrations if available
        try:
            migration_manager.upgrade_to_head()
        except Exception as e:
            logger.warning(f"Migration upgrade skipped: {e}")

    except Exception as e:
        logger.error(f"Database initialization failed: {e}")
        raise


def close_db():
    """Close database connection"""
    try:
        db_manager.engine.dispose()
        logger.info("Database connection closed")
    except Exception as e:
        logger.error(f"Failed to close database: {e}")


# ============ CONTEXT MANAGERS ============

class DatabaseSession:
    """Context manager for database sessions"""

    def __init__(self, manager: DatabaseManager = None):
        self.manager = manager or db_manager
        self.session = None

    def __enter__(self) -> Session:
        self.session = self.manager.get_session()
        return self.session

    def __exit__(self, exc_type, exc_val, exc_tb):
        if self.session:
            if exc_type:
                self.session.rollback()
            else:
                self.session.commit()
            self.session.close()

        return False


# ============ SETUP SCRIPT ============

if __name__ == '__main__':
    """Database setup from command line"""
    import sys

    logging.basicConfig(level=logging.INFO)

    if len(sys.argv) < 2:
        print("Usage: python config.py [init|migrate|health|postgis]")
        sys.exit(1)

    command = sys.argv[1]

    if command == 'init':
        print("Initializing database...")
        init_db()
        print("✓ Database initialized")

    elif command == 'migrate':
        message = sys.argv[2] if len(sys.argv) > 2 else "Auto migration"
        migration_manager.create_migration(message)
        migration_manager.upgrade_to_head()
        print("✓ Database migrated")

    elif command == 'health':
        if db_manager.health_check():
            print("✓ Database is healthy")
        else:
            print("✗ Database connection failed")
            sys.exit(1)

    elif command == 'postgis':
        if db_manager.test_postgis():
            print("✓ PostGIS is available")
        else:
            print("✗ PostGIS not available")
            sys.exit(1)

    else:
        print(f"Unknown command: {command}")
        sys.exit(1)
