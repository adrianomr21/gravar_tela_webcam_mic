# Use uma imagem base do Node.js
FROM node:18

# Instale o FFmpeg
RUN apt-get update && apt-get install -y ffmpeg

# Crie o diretório da aplicação
WORKDIR /usr/src/app

# Copie o package.json e instale as dependências
COPY package*.json ./
RUN npm install

# Copie o resto do código da aplicação
COPY . .

# Exponha a porta que a aplicação usa
EXPOSE 3000

# Comando para iniciar a aplicação
CMD [ "npm", "start" ]
