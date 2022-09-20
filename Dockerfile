FROM --platform=linux/amd64 python:3-slim-buster

EXPOSE 8080/TCP

# Keep Python from generating .pyc files in the container
ENV PYTHONDONTWRITEBYTECODE=0

# Turns off buffering for easier container logging
ENV PYTHONUNBUFFERED=1

RUN apt-get clean \
    && apt-get -y update

RUN apt-get -y install \
    python3-dev \
    build-essential

WORKDIR /app
COPY ./backend/ /app

# Install pip requirements
COPY ./backend/requirements.txt .
RUN pip install -r requirements.txt

CMD ["uvicorn", "app.api:app", "--host", "0.0.0.0", "--port", "8080"]