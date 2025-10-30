#!/usr/bin/env bash
set -e

python manage.py migrate --noinput
python manage.py collectstatic --no-input

if [ "${DEV:-0}" = "1" ]; then
  exec python manage.py runserver 0.0.0.0:8000
else
  # Note the colon here
  exec gunicorn backend.wsgi:application --bind 0.0.0.0:8000
fi