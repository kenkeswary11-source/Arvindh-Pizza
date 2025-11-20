# Backend Dockerfile for American Pizza API
FROM node:18-alpine

WORKDIR /app

# Copy package files from backend directory
COPY backend/package*.json ./

# Install production dependencies only
RUN npm install --only=production && npm cache clean --force

# Copy application code from backend directory
COPY backend/ ./

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

