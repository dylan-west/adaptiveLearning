#stage 1: Building Frontend

FROM node:18-alpine AS build-stage

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
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

WORKDIR /code

#Copy Django Project to container
COPY ./backend /code/backend

# Install dependencies
RUN pip install --upgrade pip && pip install -r /code/backend/requirements.txt

#COPY frontend build to backend static files
# COPY --from=build-stage ./code/frontend/build /code/backend/static
COPY --from=build-stage ./code/frontend/build/index.html /code/backend/backend/templates/index.html
COPY --from=build-stage ./code/frontend/build/static /code/backend/static



# Add entrypoint to run migrate + collectstatic at container start
COPY ./backend/entrypoint.sh /code/backend/entrypoint.sh
RUN chmod +x /code/backend/entrypoint.sh

EXPOSE 8000
WORKDIR /code/backend
ENTRYPOINT ["/code/backend/entrypoint.sh"]