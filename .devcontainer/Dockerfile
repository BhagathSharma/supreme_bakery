# Use an official base image with minimal setup
FROM mcr.microsoft.com/devcontainers/base:ubuntu

# Install Node.js 22 (via NodeSource)
RUN curl -fsSL https://deb.nodesource.com/setup_22.x | bash - && \
    apt-get update && \
    apt-get install -y nodejs

# Install pnpm 10
RUN npm install -g pnpm@10

# Show installed versions (for logging)
RUN node -v && npm -v && pnpm -v