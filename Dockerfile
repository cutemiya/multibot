FROM node:20

WORKDIR /app

COPY package.json ./
COPY package-lock.json ./

RUN npm install

COPY ./multibot .

CMD ["node", "script.js"]