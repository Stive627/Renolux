# Build Stage
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Production Stage
FROM nginx:stable-alpine AS production
COPY --from=build /app/build /usr/share/nginx/html

# Replace Nginx default.conf to listen on port 8080
RUN echo 'server { listen 8080; server_name localhost; location / { root /usr/share/nginx/html; index index.html; try_files $uri /index.html; } }' > /etc/nginx/conf.d/default.conf

EXPOSE 8080
CMD ["nginx", "-g", "daemon off;"]