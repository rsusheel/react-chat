# Use a small base image for production
FROM node:16.19.0-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy only the necessary files for installing dependencies
COPY package.json package-lock.json ./

# Install production dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Expose the port your app will run on
EXPOSE 3000

# Command to run your application
CMD ["node", "app.js"]