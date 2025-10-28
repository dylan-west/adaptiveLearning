#stage 1: Building Frontend

FROM node:18-alpine as build-stage

WORKDIR /code

COPY ./frontend /code/frontend

WORKDIR /code/frontend
# Install dependencies
RUN npm install

# Build the frontend
RUN npm run build

#stage 2: Building Backend
FROM python:3.11.0

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

WORKDIR /code

#Copy Django Project to container
COPY ./backend /code/backend

# Install dependencies
RUN pip install -r /code/backend/requirements.txt

#COPY frontend build to backend static files
COPY --from=build-stage ./code/frontend/build /code/backend/static
COPY --from=build-stage ./code/frontend/build/static /code/backend/static
COPY --from=build-stage ./code/frontend/build/index.html /code/backend/backend/templates/index.html

#Run Django Migrations 
RUN python /code/backend/manage.py migrate

#RUN Django Collectstatic Command
RUN python ./backend/manage.py collectstatic --no-input

#EXPOSE PORT 80
EXPOSE 80

WORKDIR /code/backend

#RUN the django server
CMD ["gunicorn", "backend.wsgi.application", "--bind", "0.0.0.0:8000"]


