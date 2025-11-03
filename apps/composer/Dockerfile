# Stage 1: Builder
FROM node:22.8.0-slim AS builder
WORKDIR /app

RUN corepack enable && corepack prepare pnpm@latest --activate

COPY . .
RUN pnpm install
RUN pnpm build

FROM node:22.8.0-slim AS final
WORKDIR /app

RUN corepack enable && corepack prepare pnpm@latest --activate

COPY --from=builder /app/dist ./dist

COPY package.json pnpm-lock.yaml ./

RUN pnpm install --prod

CMD ["pnpm", "start"]
