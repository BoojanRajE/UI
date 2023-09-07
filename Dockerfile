# Stage 1: Use yarn to build the app
# FROM node:16 as builder
# WORKDIR /usr/src/app
# COPY package.json ./
# RUN npm install
# COPY . ./
# RUN npm run build

# # Stage 2: Copy the JS React SPA into the Nginx HTML directory
# FROM bitnami/nginx:latest
# COPY --from=builder /usr/src/app/build /app
# EXPOSE 8080
# CMD ["nginx", "-g", "daemon off;"]

# Build Environment
# FROM node:16  as build
# WORKDIR /app
# COPY package*.json ./
# RUN npm install
# # Have a .dockerignore file ignoring node_modules and build
# COPY . ./
# RUN npm run build
# # Production
# FROM nginx:stable-alpine
# COPY --from=build /app/build /usr/share/nginx/html
# COPY nginx.conf /etc/nginx/nginx.conf
# CMD ["nginx", "-g", "daemon off;"]

# FROM node:16 as react-build
# WORKDIR /app
# COPY . ./
# RUN yarn
# RUN yarn build
# # Stage 2 - the production environment
# FROM nginx:alpine
# COPY nginx.conf /etc/nginx/conf.d/default.conf
# COPY --from=react-build /app/build /usr/share/nginx/html
# EXPOSE 8080
# CMD ["nginx", "-g", "daemon off;"]

# Stage 1: Use yarn to build the app
# FROM node:16 as builder
# WORKDIR /usr/src/app
# COPY package.json ./
# RUN yarn
# COPY . ./
# RUN yarn build

# # Stage 2: Copy the JS React SPA into the Nginx HTML directory
# FROM bitnami/nginx:latest
# COPY --from=builder /usr/src/app/build /app
# EXPOSE 8080
# CMD ["nginx", "-g", "daemon off;"]
# Build Environment
FROM node:16 as build
WORKDIR /app
COPY package*.json ./
RUN npm install
# Have a .dockerignore file ignoring node_modules and build
COPY . ./
RUN npm run build
# Production
FROM nginxinc/nginx-unprivileged 
COPY --from=build /app/build /usr/share/nginx/html
COPY nginx/nginx.conf /etc/nginx/nginx.conf
EXPOSE 8080
CMD ["nginx", "-g", "daemon off;"]