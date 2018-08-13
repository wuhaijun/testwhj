FROM node:6

WORKDIR /usr/src/app

COPY . /usr/src/app

RUN npm  --registry=https://registry.npm.taobao.org --disturl=https://npm.taobao.org/dist install

RUN npm run build

CMD ["npm", "start"]
