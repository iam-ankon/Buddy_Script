#!/usr/bin/env bash
set -o errexit

echo "📦 Installing Python dependencies..."
pip install -r requirements.txt

echo "📁 Creating directories..."
mkdir -p staticfiles
mkdir -p static

echo "🔄 Running migrations..."
python manage.py migrate

echo "📁 Manually copying admin static files..."
VENV_PATH="/opt/render/project/src/.venv"
ADMIN_STATIC="$VENV_PATH/lib/python3.11/site-packages/django/contrib/admin/static/admin"
if [ -d "$ADMIN_STATIC" ]; then
    cp -r $ADMIN_STATIC staticfiles/
    echo "✅ Copied admin static files"
else
    echo "❌ Admin static not found at $ADMIN_STATIC"
fi

echo "📁 Collecting static files..."
python manage.py collectstatic --no-input --clear -v 2

echo "📋 Verifying static files..."
ls -la staticfiles/admin/css/ | head -10

echo "✅ Build completed!"