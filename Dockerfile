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

# COPY nginx/nginx.conf /etc/nginx/nginx.conf

EXPOSE 8080

CMD ["nginx", "-g", "daemon off;"]