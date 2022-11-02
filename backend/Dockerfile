FROM node:16.15.1-alpine

############################################
# General Docker image configuration
############################################
WORKDIR /srv/app
EXPOSE 8080
# Based on issue: https://github.com/nodejs/docker-node/issues/1734
CMD [ "node", "src/index.js" ]
ENTRYPOINT [ "entrypoints/production.sh" ]

############################################
# System Dependencies
############################################
RUN apk update && apk add --no-cache dos2unix

############################################
# None root user
############################################
RUN chown -R node:node /srv/app
USER node
COPY --chown=node:node [ "package.json", "package-lock.json",  "./"]
COPY --chown=node:node [ "config", "config"]
COPY --chown=node:node [ "src", "src"]
COPY --chown=node:node [ "entrypoints", "entrypoints"]

############################################
# Building Application
############################################
RUN npm install
RUN dos2unix entrypoints/*
