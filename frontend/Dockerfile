FROM node:17.5.0-alpine3.14

ARG UID=1001
ARG REACT_APP_BACKEND_URL=''
ARG REACT_APP_CAPTCHA_SITE_KEY=''
WORKDIR /srv/app

EXPOSE 3000
CMD [ "npm", "start" ]

RUN adduser --disabled-password --uid "$UID" app

COPY [ "package.json", "package-lock.json",  "./"]
RUN npm install

COPY [ "public", "public"]
COPY [ "src", "src"]
RUN npm run build
