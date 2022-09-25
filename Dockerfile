FROM node:16.17.0-alpine3.16

WORKDIR . .

COPY . .

RUN npm install

RUN npm uninstall bcrypt

RUN npm install bcrypt

RUN npm audit

EXPOSE 80

CMD ["node", "index.js"]