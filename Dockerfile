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

# Copy standalone output dari Next.js build
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

# Copy public folder untuk static assets
COPY --from=builder /app/public ./public

# Buat direktori uploads dengan permissions yang benar
RUN mkdir -p /app/public/uploads/projects && \
    chown -R node:node /app

# Expose port
EXPOSE 5000

# Create startup script untuk fix permissions
RUN echo '#!/bin/sh' > /app/startup.sh && \
    echo 'mkdir -p /app/public/uploads/projects' >> /app/startup.sh && \
    echo 'chown -R node:node /app/public/uploads' >> /app/startup.sh && \
    echo 'chmod -R 755 /app/public/uploads' >> /app/startup.sh && \
    echo 'su-exec node node server.js' >> /app/startup.sh && \
    chmod +x /app/startup.sh

# Install su-exec untuk switch user di runtime
RUN apk add --no-cache su-exec

# Jalankan dengan startup script (sebagai root, tapi npm start sebagai node user)
CMD ["/app/startup.sh"]
