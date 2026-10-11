# =====================================================================
# CivicConnect Backend - Multi-Stage Production/Staging Container
# Standards: DEC-005 (Docker Parity), NFR-010 (Cost/Memory Stewardship)
# Author: Chris Fourie (602826)
# =====================================================================

# Stage 1: Build & Compilation Layer
FROM node:20-alpine AS builder
WORKDIR /app

# Install build dependencies
COPY package*.json tsconfig.json ./
RUN npm ci

# Copy source code and build TypeScript artifacts
COPY src ./src
RUN npm run build

# Stage 2: Minimal Runtime Layer
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000

# Install only production dependencies
COPY package*.json ./
RUN npm ci --omit=dev

# Copy compiled JavaScript distribution and static UI assets
COPY --from=builder /app/dist ./dist
COPY public ./public

# Unprivileged user for security hardening
USER node

EXPOSE 3000

HEALTHCHECK --interval=15s --timeout=5s --start-period=5s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://localhost:3000/health/live || exit 1

CMD ["node", "dist/server.js"]
