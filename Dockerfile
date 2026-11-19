FROM node:22-slim AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --legacy-peer-deps

FROM node:22-slim AS build
WORKDIR /app
ENV NEXT_TELEMETRY_DISABLED=1
COPY --from=deps /app/node_modules ./node_modules
COPY . .
# The build only needs placeholder values; real ones are read at runtime.
RUN PAYLOAD_SECRET=build-only DATABASE_URI=file:/tmp/build.db npm run build

FROM node:22-slim AS run
WORKDIR /app
ENV NODE_ENV=production NEXT_TELEMETRY_DISABLED=1 PORT=3000 HOSTNAME=0.0.0.0
COPY --from=build /app/.next/standalone ./
COPY --from=build /app/.next/static ./.next/static
COPY --from=build /app/public ./public
RUN mkdir -p /app/data /app/media && chown -R node:node /app/data /app/media
USER node
VOLUME ["/app/data", "/app/media"]
EXPOSE 3000
CMD ["node", "server.js"]
