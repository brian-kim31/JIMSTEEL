#!/usr/bin/env bash
# Render build step (no access to the persistent disk here).
set -o errexit
pip install -r requirements.txt
python manage.py collectstatic --no-input
