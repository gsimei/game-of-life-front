# Etapa 1: Construção da aplicação
FROM node:20-alpine AS build

WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install --frozen-lockfile
COPY . .
RUN npm run build

# Etapa 2: Servindo os arquivos estáticos com Nginx
FROM nginx:alpine

# Remove arquivos padrão do Nginx
RUN rm -rf /usr/share/nginx/html/*

# Copia os arquivos da build para o diretório padrão do Nginx
COPY --from=build /app/dist /usr/share/nginx/html

# Copia a configuração corrigida do Nginx
COPY nginx.conf /etc/nginx/nginx.conf

# Expondo a porta correta (Heroku define automaticamente via $PORT)
EXPOSE 8080

# Comando para iniciar o Nginx
CMD ["nginx", "-g", "daemon off;"]
