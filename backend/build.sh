#!/usr/bin/env bash
set -o errexit
set -o pipefail

echo "==================================="
echo "Starting build process..."
echo "==================================="

# Install dependencies
echo "📦 Installing Python dependencies..."
pip install -r requirements.txt

# Run migrations
echo "🔄 Running database migrations..."
python manage.py migrate

# Collect static files
echo "📁 Collecting static files..."
python manage.py collectstatic --no-input --clear

# Create superuser
echo "👤 Creating superuser if not exists..."
python manage.py shell <<EOF
import sys
from django.contrib.auth import get_user_model

User = get_user_model()
username = "admin"
email = "admin@example.com"
password = "admin12345"

try:
    if not User.objects.filter(username=username).exists():
        User.objects.create_superuser(username, email, password)
        print(f"✅ Superuser '{username}' created successfully!")
    else:
        print(f"ℹ️  Superuser '{username}' already exists.")
except Exception as e:
    print(f"⚠️  Error creating superuser: {e}")
    sys.exit(0)  # Don't fail the build if superuser creation fails
EOF

echo "==================================="
echo "✅ Build completed successfully!"
echo "==================================="