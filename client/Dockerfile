# Use a small base image for production
FROM nginx:1.21.1-alpine

# Set the working directory to /app
WORKDIR /app

# Copy the build files to the container
COPY build/ /app

# Setup nginx for react build
RUN sed -i "s,/usr/share/nginx/html,/app,g" /etc/nginx/conf.d/default.conf

# Expose port 80 for the application
EXPOSE 80

# Start Nginx and serve the application
CMD ["nginx", "-g", "daemon off;"]
