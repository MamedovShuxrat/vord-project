FROM node:alpine 

WORKDIR /app

COPY package.json ./
COPY package-lock.json ./
COPY ./ ./
RUN npm install
RUN npm i

CMD ["npm", "run", "start"]
