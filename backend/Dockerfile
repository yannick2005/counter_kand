FROM node:18.3.0-alpine3.14

############################################
# General Docker image configuration
############################################
ARG UID=1001
WORKDIR /srv/app
EXPOSE 8080
ENTRYPOINT [ "entrypoints/production.sh" ]
CMD [ "npm", "start" ]

############################################
# System Dependencies
############################################
RUN apk update && apk add --no-cache dos2unix
RUN adduser --disabled-password --uid "$UID" app

############################################
# None root user
############################################
COPY [ "package.json", "package-lock.json",  "./"]
COPY [ "config", "config"]
COPY [ "src", "src"]
COPY [ "entrypoints", "entrypoints"]

RUN chown -R app:app /srv/app
RUN chmod -R 755 /srv/app
USER app

############################################
# Building Application
############################################
RUN npm install
RUN npm run build

RUN dos2unix entrypoints/*
