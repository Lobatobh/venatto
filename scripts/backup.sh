#!/bin/bash

# VENATTO Backup Script
# Creates timestamped backup of production database

BACKUP_DIR="/data/backup"
DB_PATH="/data/venatto/prod.db"

# Create backup directory if it doesn't exist
mkdir -p "$BACKUP_DIR"

# Generate timestamp
TIMESTAMP=$(date +%F-%H-%M)

# Create backup
cp "$DB_PATH" "$BACKUP_DIR/prod-$TIMESTAMP.db"

echo "Backup created: $BACKUP_DIR/prod-$TIMESTAMP.db"