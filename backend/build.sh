#!/usr/bin/env bash
set -o errexit

echo "📦 Installing Python dependencies..."
pip install -r requirements.txt

echo "📁 Creating directories..."
mkdir -p staticfiles

echo "🔄 Running migrations..."
python manage.py migrate

echo "📁 Manually copying admin static files..."
VENV_PATH="/opt/render/project/src/.venv"
ADMIN_STATIC_SRC="$VENV_PATH/lib/python3.11/site-packages/django/contrib/admin/static/admin"
if [ -d "$ADMIN_STATIC_SRC" ]; then
    cp -r $ADMIN_STATIC_SRC/* staticfiles/
    echo "✅ Copied admin static files successfully"
else
    echo "❌ Admin static not found at $ADMIN_STATIC_SRC"
    exit 1
fi

# Also copy rest_framework static files if needed
REST_STATIC_SRC="$VENV_PATH/lib/python3.11/site-packages/rest_framework/static/rest_framework"
if [ -d "$REST_STATIC_SRC" ]; then
    cp -r $REST_STATIC_SRC/* staticfiles/
    echo "✅ Copied rest_framework static files"
fi

echo "📁 Running collectstatic to gather any remaining files..."
python manage.py collectstatic --no-input --clear -v 2

echo "📋 Verifying static files..."
ls -la staticfiles/
ls -la staticfiles/css/ 2>/dev/null || echo "CSS directory check"

echo "✅ Build completed!"