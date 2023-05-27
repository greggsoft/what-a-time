FROM node:16-slim

LABEL org.opencontainers.image.source=https://github.com/greggsoft/what-a-time
LABEL org.opencontainers.image.description="What A Time"
LABEL org.opencontainers.image.licenses=UNLICENSED

WORKDIR /app
COPY ./package.json .
COPY ./package-lock.json .
RUN npm ci
COPY ./index.js .
COPY ./make-dotenv.js .
RUN node make-dotenv.js

CMD [ "npm", "start" ]