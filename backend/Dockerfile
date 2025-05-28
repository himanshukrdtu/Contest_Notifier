# Use official Node.js v22 image
FROM node:22-slim

# Install Chromium dependencies
RUN apt-get update && apt-get install -y \
    wget \
    ca-certificates \
    fonts-liberation \
    libappindicator3-1 \
    libasound2 \
    libatk-bridge2.0-0 \
    libatk1.0-0 \
    libcups2 \
    libdbus-1-3 \
    libdrm2 \
    libgbm1 \
    libgtk-3-0 \
    libnspr4 \
    libnss3 \
    libx11-xcb1 \
    libxcomposite1 \
    libxdamage1 \
    libxrandr2 \
    xdg-utils \
    --no-install-recommends && \
    apt-get clean && rm -rf /var/lib/apt/lists/*

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json and install dependencies
COPY package*.json ./
RUN npm install

# Install Chromium used by Puppeteer
RUN npx puppeteer install

# Copy rest of the app code
COPY . .

# Expose port your app listens on (likely 3000)
EXPOSE 3000

# Start your app
CMD ["npm", "start"]
