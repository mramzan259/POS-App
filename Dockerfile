# --- Stage 1: Builder ---
FROM node:22.1-alpine AS builder

WORKDIR /stock_management_app

# Copy package files and install only prod deps
COPY package*.json ./
RUN npm ci

# Copy all project files (except .dockerignore)
COPY . .

# Optional: set env var for build-time (can also pass via --build-arg)
ARG MONGODB_URI
ENV MONGODB_URI=$MONGODB_URI

# Build the app
RUN npm run build

# --- Stage 2: Production ---
FROM node:22.1-alpine AS runner

WORKDIR /stock_management_app

# Copy standalone app build output
COPY --from=builder /stock_management_app/.next/standalone ./
COPY --from=builder /stock_management_app/.next/static ./.next/static
COPY --from=builder /stock_management_app/public ./public

# Set environment and port
ENV NODE_ENV=production
EXPOSE 3000

# Run Next.js standalone server
CMD ["node", "server.js"]





# # Stage 1: Build
# FROM node:22.1-alpine AS builder
# WORKDIR /stock_management_app

# COPY package*.json ./
# RUN npm ci

# COPY . .
# RUN npm run build

# # Stage 2: Production
# FROM node:22.1-alpine AS runner
# WORKDIR /stock_management_app

# COPY --from=builder /stock_management_app/.next/standalone ./
# COPY --from=builder /stock_management_app/.next/static ./.next/static
# COPY --from=builder /stock_management_app/public ./public

# ENV NODE_ENV=production
# EXPOSE 3000

# CMD ["node", "server.js"]


# Stage 1: Build
# FROM node:22.1-alpine AS base

# WORKDIR /stock_management_app

# COPY package*.json ./
# RUN npm ci

# COPY . .

# RUN npm run build

# # Stage 2: Production
# FROM node:22.1-alpine AS production

# WORKDIR /stock_management_app

# COPY --from=base /stock_management_app/package*.json ./
# COPY --from=base /stock_management_app/public ./public
# COPY --from=base /stock_management_app/.next .next
# COPY --from=base /stock_management_app/node_modules ./node_modules
# COPY --from=base /stock_management_app/next.config.js ./
# COPY --from=base /stock_management_app/src ./src

# ENV NODE_ENV=production
# EXPOSE 3000

# CMD ["npm", "start"]
