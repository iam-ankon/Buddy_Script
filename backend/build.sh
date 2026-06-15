#!/usr/bin/env bash
set -o errexit
set -o pipefail

echo "==================================="
echo "Starting build process..."
echo "==================================="

# Install dependencies
echo "📦 Installing Python dependencies..."
pip install -r requirements.txt

# Create necessary directories
echo "📁 Creating directories..."
mkdir -p staticfiles
mkdir -p static

# Run migrations
echo "🔄 Running database migrations..."
python manage.py migrate

# Collect static files - THIS IS CRITICAL
echo "📁 Collecting static files..."
python manage.py collectstatic --no-input --clear -v 2

# List collected static files (for debugging)
echo "📋 Static files collected:"
ls -la staticfiles/ || echo "No staticfiles directory"

# Create superuser
echo "👤 Creating superuser if not exists..."
python manage.py shell <<EOF
from django.contrib.auth import get_user_model
User = get_user_model()
username = "admin"
email = "admin@example.com"
password = "admin12345"

if not User.objects.filter(username=username).exists():
    User.objects.create_superuser(username, email, password)
    print(f"✅ Superuser '{username}' created successfully!")
else:
    print(f"ℹ️  Superuser '{username}' already exists.")
EOF

echo "==================================="
echo "✅ Build completed successfully!"
echo "==================================="