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
