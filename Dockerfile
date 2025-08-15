# Use the official Node.js latest LTS image as base
FROM node:lts-alpine

# Set working directory
WORKDIR /app

# Configure npm for better network handling
RUN npm config set fetch-timeout 600000 && \
    npm config set fetch-retry-mintimeout 20000 && \
    npm config set fetch-retry-maxtimeout 120000 && \
    npm config set fetch-retries 3

# Copy package.json and package-lock.json (if available)
COPY package*.json ./

# Install dependencies with increased timeout and retries
RUN npm install --omit=dev --verbose

# Copy the rest of the application code
COPY . .

# Set environment variables for build
ENV NEXT_TELEMETRY_DISABLED=1

# Build the Next.js application with proper network settings
RUN npm run build

# Expose the port the app runs on
EXPOSE 5000

# Set environment to production
ENV NODE_ENV=production
ENV PORT=5000

# Create non-root user for security
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001

# Change ownership of the app directory to nextjs user
RUN chown -R nextjs:nodejs /app
USER nextjs

# Start the application
CMD ["npm", "start"]
