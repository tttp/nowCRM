FROM node:24-alpine AS common-deps

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

WORKDIR /app

# Copy only the necessary files for dependency resolution
COPY ./package.json ./pnpm-lock.yaml ./pnpm-workspace.yaml ./tsconfig.base.json ./tsconfig.json /app/


COPY ./apps/nowcrm/package.json /app/apps/nowcrm/
COPY ./libs/services/package.json /app/libs/services/

RUN pnpm install --frozen-lockfile

FROM common-deps AS builder

# Copy sourcecode after installing dependences to accelerate subsequents builds
COPY ./apps/nowcrm /app/apps/nowcrm
COPY ./libs/services /app/libs/services

RUN pnpm --filter @nowcrm/nowcrm build

FROM node:24-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production

COPY --from=builder /app/apps/nowcrm/.next/standalone ./
COPY --from=builder /app/apps/nowcrm/.next/static ./apps/nowcrm/.next/static
COPY --from=builder /app/apps/nowcrm/public ./apps/nowcrm/public

RUN chown -R node:node /app

USER node

WORKDIR /app/apps/nowcrm

EXPOSE 3000

CMD ["node", "server.js"]