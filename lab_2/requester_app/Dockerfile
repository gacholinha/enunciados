# Use uma imagem base leve do Node.js
FROM node:18-alpine

# Define o diretório de trabalho dentro do container
WORKDIR /usr/src/app

# Copia os arquivos de dependência e instala elas
# Isso aproveita o cache do Docker, para não reinstalar a cada build
COPY package*.json ./
RUN npm install

# Copia o resto do código da aplicação
COPY . .

# Comando para iniciar a aplicação quando o container rodar
CMD [ "npm", "start" ]