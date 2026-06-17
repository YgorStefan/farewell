
FROM node:22-alpine

WORKDIR /app
RUN chown node:node /app
USER node

COPY --chown=node:node package*.json ./

RUN npm install

COPY --chown=node:node index.html vite.config.js ./
COPY --chown=node:node public ./public
COPY --chown=node:node src ./src

EXPOSE 5173

CMD ["npm", "run", "dev", "--", "--host"]
