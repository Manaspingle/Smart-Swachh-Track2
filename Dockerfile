FROM node:22-bookworm-slim AS build

WORKDIR /app

# Enable pnpm via corepack
RUN corepack enable

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml tsconfig.json tsconfig.base.json ./
COPY scripts ./scripts
COPY lib ./lib
COPY artifacts ./artifacts

RUN pnpm install --frozen-lockfile

# Build libs + frontend + backend
ENV BASE_PATH=/
RUN pnpm run build

FROM node:22-bookworm-slim AS runtime

WORKDIR /app
ENV NODE_ENV=production

RUN corepack enable

# Copy only what we need at runtime:
# - bundled server output
# - frontend build output served by the server
# - package.json files for node resolution (workspace deps are bundled/externalized as needed)
COPY --from=build /app/artifacts/api-server/dist /app/artifacts/api-server/dist
COPY --from=build /app/artifacts/api-server/package.json /app/artifacts/api-server/package.json
COPY --from=build /app/artifacts/swachhtrack/dist/public /app/artifacts/swachhtrack/dist/public

EXPOSE 3001

# Expect env vars at runtime:
# - PORT
# - DATABASE_URL
# - JWT_SECRET
CMD ["node", "artifacts/api-server/dist/index.cjs"]

