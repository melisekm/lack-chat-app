FROM node:lts

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .
COPY .env.production .env

EXPOSE ${PORTS}

CMD [ "npm", "run", "dev"]
