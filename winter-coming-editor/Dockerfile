FROM node:6

WORKDIR /usr/src/app

COPY . /usr/src/app

RUN npm install

RUN npm run build

CMD ["npm", "start"]