FROM node:20-alpine

WORKDIR /app

COPY package.json ./
COPY server.js ./

ENV PORT=4003

EXPOSE 4003

CMD ["node", "server.js"]
