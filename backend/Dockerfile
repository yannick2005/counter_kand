FROM node:17.5.0-alpine3.14

ARG UID=1001
WORKDIR /srv/app
EXPOSE 8080
ENTRYPOINT [ "entrypoints/production.sh" ]
CMD [ "npm", "start" ]

RUN adduser --disabled-password --uid "$UID" app

COPY [ "package.json", "package-lock.json",  "./"]
RUN npm install

COPY [ "config", "config"]
COPY [ "src", "src"]
COPY [ "entrypoints", "entrypoints"]

RUN npm run build
