FROM node:12
WORKDIR /code

COPY . .
RUN yarn
