# Use specific, updated Node.js Alpine image to avoid vulnerabilities
FROM node:22.19-alpine3.22 as build

# Add security updates and remove potential vulnerabilities
RUN apk update && apk upgrade && apk add --no-cache curl

# Set non-root user for security
USER node
WORKDIR /app

# Copy package files
COPY --chown=node:node package*.json ./

# Install dependencies with security considerations
RUN npm ci --only=production && npm cache clean --force

# Copy source code
COPY --chown=node:node . .

# Build the app
RUN npm run build

# Production stage with specific nginx version
FROM nginx:1.27.3-alpine3.22

# Switch to non-root user
RUN apk update && apk upgrade && \
    addgroup -g 101 -S nginx && \
    adduser -S nginx -G nginx -u 101 && \
    chown -R nginx:nginx /var/cache/nginx && \
    chmod -R 755 /var/cache/nginx

# Remove unnecessary packages and clean up
RUN rm -rf /var/cache/apk/*

# Copy built assets from build stage
COPY --from=build --chown=nginx:nginx /app/dist /usr/share/nginx/html

# Copy custom nginx config for security headers
COPY --from=build --chown=nginx:nginx /app/nginx.conf /etc/nginx/nginx.conf

# Examine and remove any sensitive files
RUN find /usr/share/nginx/html -name ".env" -type f -delete || true

# Expose port 80
EXPOSE 80

# Run as non-root user
USER nginx

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost/ || exit 1

# Start nginx
CMD ["nginx", "-g", "daemon off;"]