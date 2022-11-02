FROM node:16.15.1-alpine

############################################
# General Docker image configuration
############################################
WORKDIR /srv/app
EXPOSE 3000
CMD [ "npm", "start" ]
ENTRYPOINT [ "./entrypoint.sh" ]

############################################
# System Dependencies
############################################
RUN apk add --no-cache gettext dos2unix vim

############################################
# None root user
############################################
RUN chown -R node:node /srv/app
USER node
COPY --chown=node:node [ "package.json", "package-lock.json",  "./"]
COPY --chown=node:node [ "./entrypoint.sh", "./entrypoint.sh"]
COPY --chown=node:node [ "public", "public"]
COPY --chown=node:node [ "src", "src"]

############################################
# Building Application
############################################
RUN npm install
RUN npm run build

RUN dos2unix entrypoint.sh
