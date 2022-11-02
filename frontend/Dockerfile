FROM node:18.3.0-alpine3.14

############################################
# General Docker image configuration
############################################
WORKDIR /srv/app
EXPOSE 3000
#CMD [ "npm", "start" ]
#ENTRYPOINT [ "./entrypoint.sh" ]
CMD ["tail", "-f", "/dev/null"]

############################################
# System Dependencies
############################################
RUN apk add --no-cache gettext dos2unix vim
RUN adduser -D app

############################################
# None root user
############################################
COPY [ "package.json", "package-lock.json",  "./"]
COPY [ "./entrypoint.sh", "./entrypoint.sh"]
COPY [ "public", "public"]
COPY [ "src", "src"]




############################################
# Building Application
############################################
RUN npm install
RUN npm run build

RUN dos2unix entrypoint.sh


RUN chgrp -R 0 /srv/app && \
    chmod -R g=u /srv/app 
RUN chmod +x entrypoint.sh