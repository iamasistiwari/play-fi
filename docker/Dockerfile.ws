FROM node:23-alpine

ARG REDIS_URL
RUN apk add --no-cache python3 make g++

WORKDIR /app

RUN npm install -g pnpm


COPY package.json pnpm-lock.yaml ./
COPY turbo.json ./
COPY pnpm-workspace.yaml ./

COPY apps/ws/ apps/ws/
COPY packages/ packages/

RUN pnpm install

RUN pnpm run build-ws

EXPOSE 3011

CMD ["pnpm", "run", "start-ws"]