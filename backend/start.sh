#!/usr/bin/env bash
# Render start step: runs with the persistent disk mounted, so seeding media works here.
set -o errexit
python manage.py migrate --no-input
python manage.py seed_content            # no-op once content exists
if [ -n "$DJANGO_SUPERUSER_USERNAME" ]; then
  python manage.py createsuperuser --no-input 2>/dev/null || true   # ignored if it already exists
fi
exec gunicorn config.wsgi --bind 0.0.0.0:${PORT:-8000} --workers 2 --timeout 60
