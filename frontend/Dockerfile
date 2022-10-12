FROM node:18.3.0-alpine3.14

ARG UID=1001
WORKDIR /srv/app
EXPOSE 3000
CMD [ "npm", "start" ]
ENTRYPOINT [ "./entrypoint.sh" ]
RUN apk add --no-cache gettext
RUN adduser --disabled-password --uid "$UID" app

COPY [ "package.json", "package-lock.json",  "./"]
RUN npm install

COPY [ "./entrypoint.sh", "./entrypoint.sh"]
COPY [ "public", "public"]
COPY [ "src", "src"]
RUN npm run build
