#  Build static assets
FROM node:22-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY tsconfig.json webpack.config.mjs ./
COPY public ./public
COPY src ./src
RUN npm run build

# Serve with nginx
FROM nginx:1.27-alpine
COPY --from=build /app/public /usr/share/nginx/html
COPY --from=build /app/dist   /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80

