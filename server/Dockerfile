FROM node 

WORKDIR /server/

COPY .env .env

COPY package.json package.json

COPY . .

RUN npm install

EXPOSE 5000

CMD ["node","index.js"]



