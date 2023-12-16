FROM node:20

WORKDIR /app

COPY ./multibot/package.json ./
COPY ./multibot/package-lock.json ./

RUN npm ci

COPY ./multibot .

CMD ["node", "script.js"]