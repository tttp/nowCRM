FROM node:22-slim AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

# ----------------------
# Build stage
# ----------------------
FROM base AS build
WORKDIR /usr/src/app

# Copy only dependency manifests first (for caching)
COPY pnpm-lock.yaml ./
COPY pnpm-workspace.yaml ./
COPY package.json ./
COPY tsconfig.base.json ./
COPY tsconfig.json ./

# Copy only required packages and apps
COPY libs ./libs
COPY apps/nowcrm ./apps/nowcrm

# Install dependencies with cache mount
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile

# Build the selected app (and any dependent workspaces)
ENV NEXT_TELEMETRY_DISABLED=1
ENV NEXT_PRIVATE_STANDALONE=true
RUN pnpm run -r build

# ----------------------
# Runtime stage
# ----------------------
FROM base AS runner
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV NEXT_PRIVATE_STANDALONE=true

WORKDIR /app

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=build /usr/src/app/apps/nowcrm/public ./public
COPY --from=build --chown=nextjs:nodejs /usr/src/app/apps/nowcrm/.next/standalone ./
COPY --from=build --chown=nextjs:nodejs /usr/src/app/apps/nowcrm/.next/static ./.next/static

USER nextjs

EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

CMD ["node", "server.js"]