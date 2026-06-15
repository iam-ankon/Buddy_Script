#!/usr/bin/env bash
set -o errexit

echo "📦 Installing Python dependencies..."
pip install -r requirements.txt

echo "📁 Creating directories..."
mkdir -p staticfiles

echo "🔄 Running migrations..."
python manage.py migrate

echo "📁 Copying admin static files from virtual environment..."
cp -r /opt/render/project/src/.venv/lib/python3.11/site-packages/django/contrib/admin/static/admin/* staticfiles/ 2>/dev/null || \
cp -r /opt/render/project/src/.venv/local/lib/python3.11/site-packages/django/contrib/admin/static/admin/* staticfiles/ 2>/dev/null || \
echo "⚠️ Could not copy admin static files"

echo "📁 Running collectstatic for any remaining files..."
python manage.py collectstatic --no-input --clear 2>/dev/null || true

echo "📋 Verifying..."
ls staticfiles/css/ 2>/dev/null && echo "✅ CSS files present" || echo "⚠️ No CSS files"

echo "✅ Build completed!"