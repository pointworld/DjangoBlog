#!/bin/bash

python manage.py makemigrations
python manage.py migrate
python manage.py collectstatic --noinput
python manage.py compress --force

gunicorn DjangoBlog.wsgi -c gunicorn.py

tail -f /dev/null
