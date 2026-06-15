#!/usr/bin/env bash
set -o errexit

echo "📦 Installing Python dependencies..."
pip install -r requirements.txt

echo "📁 Creating directories..."
mkdir -p staticfiles

echo "🔄 Running migrations..."
python manage.py migrate

echo "📁 Collecting static files..."
python manage.py collectstatic --no-input

echo "📋 Verifying..."
ls staticfiles/admin/css/ 2>/dev/null && echo "✅ Admin CSS files present" || echo "⚠️ No admin CSS files found"

echo "✅ Build completed!"