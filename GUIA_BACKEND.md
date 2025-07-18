# Guia de Hospedagem de Backend para Conversão de Vídeo

Este guia explica como criar e hospedar um pequeno serviço de backend para converter os vídeos gravados de WebM para MP4. Usaremos opções gratuitas que são ideais para projetos de pequeno a médio porte.

## Visão Geral da Arquitetura

1.  **Frontend (Cliente):** Seu gravador de tela (HTML/CSS/JS) que roda no navegador do usuário. Ele continuará hospedado em um serviço para sites estáticos como o GitHub Pages.
2.  **Backend (Servidor):** Uma pequena aplicação, que escreveremos em **Node.js**, responsável por receber um arquivo de vídeo, convertê-lo usando **FFmpeg** e devolvê-lo.
3.  **Plataforma de Hospedagem do Backend:** Um serviço de "Platform as a Service" (PaaS) que oferece um nível gratuito para rodar nossa aplicação Node.js.

---

## Opções Gratuitas para Hospedagem de Backend

Para rodar um backend Node.js que precisa de uma dependência externa como o FFmpeg, precisamos de mais flexibilidade do que a hospedagem de sites estáticos oferece. As melhores opções gratuitas são:

1.  **Render**: Uma plataforma moderna e uma excelente alternativa ao Heroku (que descontinuou seu plano gratuito). O plano gratuito do Render é generoso, suporta Node.js e, crucialmente, permite a instalação de dependências como o FFmpeg através de Docker.

2.  **Replit**: Um ambiente de desenvolvimento online que também hospeda projetos. É extremamente simples de configurar e permite instalar o FFmpeg. Ótimo para prototipagem e projetos menores.

3.  **Fly.io**: Outra plataforma moderna que oferece um nível gratuito e opera com Docker, tornando a instalação do FFmpeg simples. É muito poderosa, mas talvez um pouco mais complexa para iniciantes em comparação com o Render.

**Recomendação para você:** Comece com o **Render**. Ele oferece um equilíbrio perfeito entre facilidade de uso e poder, ensinando práticas modernas como o uso de Docker, que é uma habilidade muito valiosa.

---

## Roteiro de Implementação Futura

Quando você decidir implementar o conversor, este será o plano de ação:

### Parte 1: Criar o Código do Backend em Node.js

Você precisará criar uma nova pasta (ex: `backend`) no seu projeto com os seguintes arquivos:

**a) `package.json`**: Define as dependências do projeto.
```json
{
  "name": "video-converter-backend",
  "version": "1.0.0",
  "main": "server.js",
  "scripts": {
    "start": "node server.js"
  },
  "dependencies": {
    "express": "^4.18.2",
    "multer": "^1.4.5-lts.1",
    "cors": "^2.8.5"
  }
}
```

**b) `server.js`**: O código do servidor Express que faz a mágica.
```javascript
const express = require('express');
const multer = require('multer');
const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3000;

// Habilita CORS para que seu frontend no GitHub Pages possa chamar o backend
app.use(cors());

// Configura o Multer para upload de arquivos em memória
const upload = multer({ storage: multer.memoryStorage() });

// Rota de conversão
app.post('/convert', upload.single('video'), (req, res) => {
    if (!req.file) {
        return res.status(400).send('Nenhum arquivo enviado.');
    }

    const inputPath = path.join(__dirname, 'temp_input.webm');
    const outputPath = path.join(__dirname, 'temp_output.mp4');

    // Salva o buffer do vídeo recebido em um arquivo temporário
    fs.writeFileSync(inputPath, req.file.buffer);

    // Executa o comando FFmpeg
    exec(`ffmpeg -i ${inputPath} -c:v libx264 ${outputPath}`, (error, stdout, stderr) => {
        // Apaga o arquivo de entrada após a conversão
        fs.unlinkSync(inputPath);

        if (error) {
            console.error(`Erro no FFmpeg: ${stderr}`);
            return res.status(500).send('Erro durante a conversão do vídeo.');
        }

        // Envia o arquivo convertido para download e o apaga depois
        res.download(outputPath, 'gravacao.mp4', (err) => {
            if (err) {
                console.error('Erro ao enviar o arquivo:', err);
            }
            fs.unlinkSync(outputPath); // Apaga o arquivo de saída
        });
    });
});

app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`);
});
```

### Parte 2: Hospedar o Backend no Render

1.  **Crie um `Dockerfile`**: Na mesma pasta `backend`, crie um arquivo chamado `Dockerfile` (sem extensão). Este arquivo diz ao Render como construir seu ambiente.

    ```Dockerfile
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
    ```

2.  **Faça o Deploy no Render**:
    *   Envie a nova pasta `backend` com todos os arquivos para o seu repositório no GitHub.
    *   Crie uma conta no [Render](https://render.com/).
    *   No painel, clique em **"New +"** > **"Web Service"**.
    *   Conecte seu repositório do GitHub e selecione o repositório do gravador.
    *   Nas configurações, defina o **"Root Directory"** para `backend`.
    *   O Render deve detectar automaticamente seu `Dockerfile`. Se não, configure o **"Runtime"** para **"Docker"**.
    *   Dê um nome ao seu serviço (ex: `gravador-conversor`).
    *   Clique em **"Create Web Service"**.

O Render irá construir a imagem Docker, instalar as dependências e iniciar seu servidor. Ao final, ele fornecerá uma URL pública para o seu backend (ex: `https://gravador-conversor.onrender.com`).

### Parte 3: Atualizar o Frontend

Finalmente, você precisaria modificar o `script.js` do seu frontend para, em vez de criar um link de download para o `.webm`, fazer o seguinte na função `handleStopRecording`:

```javascript
// ... dentro de handleStopRecording
const blob = new Blob(recordedChunks, { type: 'video/webm' });

const formData = new FormData();
formData.append('video', blob, 'gravacao.webm');

statusElement.innerText = 'Enviando para o servidor e convertendo...';

// Envia o vídeo para o seu novo backend
fetch('https://SEU-BACKEND.onrender.com/convert', {
    method: 'POST',
    body: formData
})
.then(response => response.blob())
.then(mp4Blob => {
    const url = URL.createObjectURL(mp4Blob);
    // Agora a URL é do vídeo MP4, pronto para download
    recordedVideo.src = url;
    downloadRecordingButton.classList.remove('hidden');
    statusElement.innerText = 'Conversão concluída!';
})
.catch(error => {
    console.error('Erro:', error);
    statusElement.innerText = 'Falha na conversão.';
});

recordedChunks = [];
```

E é isso! Com esses passos, você teria um fluxo de trabalho completo e profissional, mantendo tudo gratuito. Salve este guia para quando estiver pronto para dar o próximo passo.
