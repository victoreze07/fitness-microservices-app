FROM node:20-alpine

WORKDIR /app

COPY package.json ./
COPY server.js ./

ENV PORT=4001

EXPOSE 4001

CMD ["node", "server.js"]
