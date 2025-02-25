FROM node:20

# Create and change to the app directory
WORKDIR /app

# Copy application dependency manifests to the container image
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy frontend files (index.html) to the app directory
COPY frontend/index.html ./index.html  

# Copy static files (images, etc.) from frontend/public/pic to /app/public
COPY frontend/public/pic /app/public/pic 

# Expose port 5173 for Vite
# EXPOSE 5173

# Run the web service on container startup
CMD ["npm", "run", "dev"]
