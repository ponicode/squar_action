FROM node:14.18.0-alpine3.14
# Copies your code file from your action repository to the filesystem path `/` of the container

WORKDIR /app

COPY . /app
RUN npm ci
RUN npm run build

RUN chmod +x /app/entrypoint.sh

# Code file to execute when the docker container starts up (`entrypoint.sh`)
ENTRYPOINT ["/bin/bash", "/app/entrypoint.sh"]