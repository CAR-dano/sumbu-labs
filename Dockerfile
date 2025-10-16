# Gunakan Node.js LTS berbasis Alpine (ringan)
FROM node:lts-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package.json dan package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy semua source code
COPY . .

# Build arguments for Next.js build time
ARG MONGODB_URI
ARG JWT_SECRET
ARG ADMIN_COOKIE_NAME
ARG NEXT_PUBLIC_API_URL

# Set environment variables for build
ENV MONGODB_URI=${MONGODB_URI}
ENV JWT_SECRET=${JWT_SECRET}
ENV ADMIN_COOKIE_NAME=${ADMIN_COOKIE_NAME}
ENV NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL}

# Build Next.js untuk production
RUN npm run build

# Stage production image
FROM node:lts-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=5000

# Copy hasil build dari tahap builder
COPY --from=builder /app ./

# Buat direktori uploads dengan permissions yang benar
RUN mkdir -p /app/public/uploads/projects && \
    chown -R node:node /app/public/uploads

# Hanya install dependencies production
RUN npm ci --only=production

# Switch to non-root user
USER node

# Expose port
EXPOSE 5000

# Jalankan aplikasi
CMD ["npm", "start"]
