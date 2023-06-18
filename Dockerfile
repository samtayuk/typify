# syntax=docker/dockerfile:1

FROM python:3.10-bullseye AS builder
RUN pip install poetry
COPY ./backend /app
WORKDIR /app
RUN poetry install
EXPOSE 5000
CMD poetry run typify serve