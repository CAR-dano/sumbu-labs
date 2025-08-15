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

# Build Next.js untuk production
RUN npm run build

# Stage production image
FROM node:lts-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=5000

# Copy hasil build dari tahap builder
COPY --from=builder /app ./

# Hanya install dependencies production
RUN npm ci --only=production

# Expose port
EXPOSE 5000

# Jalankan aplikasi
CMD ["npm", "start"]
