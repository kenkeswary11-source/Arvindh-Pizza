# Backend Dockerfile for American Pizza API
FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install production dependencies only - BREAK CACHE with timestamp
RUN echo "Build timestamp: $(date)" && \
    rm -rf node_modules package-lock.json 2>/dev/null || true && \
    npm install --only=production --no-audit && \
    npm cache clean --force && \
    npm list cloudinary || (echo "ERROR: cloudinary package not found!" && exit 1)

# Copy application code
COPY . .

# Create uploads directory
RUN mkdir -p uploads && chmod 755 uploads

# Set production environment
ENV NODE_ENV=production
ENV PORT=5000
ENV HOST=0.0.0.0

# Expose port
EXPOSE 5000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=40s --retries=3 \
  CMD node -e "require('http').get('http://localhost:5000/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

# Start server
CMD ["node", "server.js"]

