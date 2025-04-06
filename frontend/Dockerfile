# Étape 1 : Build React
FROM node:18 as build
WORKDIR /app
COPY . .
RUN npm install
RUN npm run build

# Étape 2 : Serveur NGINX simple
FROM nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html
# La ligne nginx.conf est mise entre parenthèses / commentée
# COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
