#!/bin/bash

TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/backups/postgres"
DB_NAME="borehole_db"
DB_USER="user"

mkdir -p $BACKUP_DIR

pg_dump -U $DB_USER $DB_NAME > "$BACKUP_DIR/backup_$TIMESTAMP.sql"

# Upload to S3
aws s3 cp "$BACKUP_DIR/backup_$TIMESTAMP.sql" s3://borehole-ai-backups/

echo "Database backup completed: backup_$TIMESTAMP.sql"

# Keep only last 30 days
find $BACKUP_DIR -name "backup_*.sql" -mtime +30 -delete