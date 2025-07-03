# Build React
FROM node:18-bullseye-slim AS build
WORKDIR /app
COPY . .


# Installe les dépendances + sass nécessaire pour .scss
RUN npm install
RUN npm install sass

# Build la version de production
RUN npm run build

# Étape finale : serveur Node.js léger avec `serve`
FROM node:18-bullseye-slim AS production
WORKDIR /app
RUN npm install -g serve
COPY --from=build /app/build /app/build
EXPOSE 3000
CMD ["serve", "-s", "build", "-l", "3000"]
