FROM node:14.16.0-alpine

WORKDIR /app

ENV PATH /app/node_modules/.bin:$PATH

COPY . /app

RUN npm install --silent
