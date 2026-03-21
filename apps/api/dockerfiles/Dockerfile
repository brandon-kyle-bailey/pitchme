# =============================================================================
# Stage 1: Builder - Compile TypeScript
# =============================================================================
FROM node:24-alpine AS builder

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install --legacy-peer-deps

# Copy source and build
COPY . .
RUN npm run build

# =============================================================================
# Stage 2: Production - Minimal runtime image
# =============================================================================
FROM node:24-alpine AS runner

WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package*.json ./

# Install dependencies
RUN npm install --legacy-peer-deps --omit=dev

USER node

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget -qO- http://localhost:80/health || exit 1

CMD ["node", "dist/main"]
