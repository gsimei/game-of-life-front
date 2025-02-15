# Stage 1: Building the application
FROM node:20-alpine AS build

WORKDIR /app

# Define a build argument
ARG VITE_BUILD_MODE=production

# Pass this argument as an environment variable for the build
ENV VITE_BUILD_MODE=$VITE_BUILD_MODE

# Copy and install dependencies
COPY package.json package-lock.json ./
RUN npm install --frozen-lockfile
COPY . .

# Use the mode defined at build time
RUN npm run build -- --mode $VITE_BUILD_MODE

# Stage 2: Serving the static files with Nginx
FROM nginx:alpine

# Remove default Nginx HTML files
RUN rm -rf /usr/share/nginx/html/*
# Copy the built files from the build stage
COPY --from=build /app/dist /usr/share/nginx/html
# Copy the Nginx configuration template
COPY default.conf.template /etc/nginx/conf.d/default.conf.template

# Expose port 8080
EXPOSE 8080
# Substitute environment variables in the Nginx configuration and start Nginx
CMD ["sh", "-c", "envsubst '$PORT' < /etc/nginx/conf.d/default.conf.template > /etc/nginx/conf.d/default.conf && exec nginx -g 'daemon off;'"]
