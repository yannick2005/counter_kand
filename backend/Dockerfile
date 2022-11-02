FROM node:18.3.0-alpine3.14

############################################
# General Docker image configuration
############################################
WORKDIR /srv/app
EXPOSE 8080
CMD ["npm", "run", "start"]
ENTRYPOINT [ "entrypoints/production.sh" ]

############################################
# System Dependencies
############################################
RUN apk update && apk add --no-cache dos2unix

############################################
# None root user
############################################
USER node
COPY [ "package.json", "package-lock.json",  "./"]
COPY [ "config", "config"]
COPY [ "src", "src"]
COPY [ "entrypoints", "entrypoints"]

############################################
# Building Application
############################################
RUN npm install
RUN dos2unix entrypoints/*

RUN chgrp -R 0 /srv/app && \
    chmod -R g=u /srv/app
