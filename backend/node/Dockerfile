FROM node:22-bookworm-slim

WORKDIR /app/backend/node

COPY backend/node/package*.json ./
RUN npm install

COPY backend/node /app/backend/node
COPY frontend /app/frontend

EXPOSE 3001

CMD ["npm", "run", "start"]
