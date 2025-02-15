FROM node:20-alpine AS build

WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install --frozen-lockfile
COPY . .
RUN npm run build

FROM nginx:alpine

# Remover arquivos padrão
RUN rm -rf /usr/share/nginx/html/*

# Copiar build
COPY --from=build /app/dist /usr/share/nginx/html

# Copia template
COPY default.conf.template /etc/nginx/conf.d/default.conf.template

# [Opcional] Remover user directive do /etc/nginx/nginx.conf se precisar
# RUN sed -i 's/user  nginx;//' /etc/nginx/nginx.conf

# A porta exposta aqui é irrelevante pro Heroku, mas útil localmente
EXPOSE 8080

CMD ["sh", "-c", "envsubst '$PORT' < /etc/nginx/conf.d/default.conf.template > /etc/nginx/conf.d/default.conf && exec nginx -g 'daemon off;'"]
