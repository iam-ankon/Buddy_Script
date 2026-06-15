#!/usr/bin/env bash
set -o errexit

echo "📦 Installing Python dependencies..."
pip install -r requirements.txt

# Create necessary directories
echo "📁 Creating directories..."
mkdir -p staticfiles
mkdir -p static

# Run migrations
echo "🔄 Running migrations..."
python manage.py migrate

# Collect static files with verbose output
echo "📁 Collecting static files..."
python manage.py collectstatic --no-input --clear -v 2

# Verify static files were collected
echo "📋 Verifying static files..."
if [ -d "staticfiles/admin" ]; then
    echo "✅ Admin static files found!"
    ls -la staticfiles/admin/css/ | head -10
else
    echo "❌ Admin static files missing! Checking Django installation..."
    python -c "import django; print(django.__path__)"
    find /opt/render/project/src/.venv -name "admin" -type d 2>/dev/null | head -5
fi

echo "✅ Build completed!"