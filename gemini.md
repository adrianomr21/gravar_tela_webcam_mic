# Documentação do Projeto: Gravador de Tela, Webcam e Microfone

## Visão Geral

Este projeto é uma aplicação web simples para gravação de tela, webcam e áudio do microfone. A interface permite ao usuário controlar as fontes de gravação, iniciar, pausar, parar e baixar a gravação resultante.

## Tecnologias Utilizadas

*   **HTML5:** Estrutura da página web.
*   **CSS3:** Estilização da interface do usuário.
*   **JavaScript (ES6+):** Lógica da aplicação, manipulação do DOM e uso das APIs de mídia do navegador.

## Arquivos do Projeto

*   `index.html`: Contém a estrutura HTML da aplicação, incluindo os elementos de vídeo para a webcam e para a gravação finalizada, além dos botões de controle.
*   `style.css`: Define a aparência da aplicação, como cores, layout dos botões e o medidor de áudio.
*   `script.js`: O coração da aplicação. Este arquivo contém todo o código JavaScript para:
    *   Acessar e controlar a webcam e o microfone usando `navigator.mediaDevices.getUserMedia`.
    *   Capturar a tela usando `navigator.mediaDevices.getDisplayMedia`.
    *   Utilizar a API `MediaRecorder` para gravar os streams de vídeo e áudio.
    *   Gerenciar os estados da aplicação (gravando, pausado, etc.).
    *   Implementar a funcionalidade de Picture-in-Picture (PiP).
    *   Criar e disponibilizar o link para download do vídeo gravado.
*   `README.md`: Um arquivo com uma breve descrição do projeto.
*   `favicon.ico`: Ícone da aplicação.

## Funcionalidades

*   **Gravação de Tela:** Captura a tela inteira do usuário, uma janela de aplicação ou uma aba do navegador.
*   **Gravação de Webcam:** Exibe o feed da webcam do usuário em um elemento de vídeo.
*   **Gravação de Microfone:** Captura o áudio do microfone do usuário.
*   **Controles de Mídia:**
    *   Ligar/Desligar Webcam.
    *   Ligar/Desligar Microfone.
    *   Mutar/Desmutar o microfone durante a gravação.
    *   Ativar/Desativar modo Picture-in-Picture para a webcam.
*   **Controles de Gravação:**
    *   Iniciar/Parar a gravação.
    *   Pausar/Retomar a gravação.
    *   Baixar a gravação finalizada no formato `.webm`.
*   **Medidor de Áudio:** Uma barra visual que indica o nível do volume do microfone.

## Como Funciona

1.  **Permissões:** O usuário concede permissão ao navegador para acessar a tela, a webcam e o microfone.
2.  **Captura de Streams:** O `script.js` utiliza as APIs `getDisplayMedia` e `getUserMedia` para obter os `MediaStream`s da tela, webcam e microfone.
3.  **Combinação de Streams:** Os trilhos (tracks) de áudio e vídeo dos diferentes streams são adicionados a um `MediaStream` principal.
4.  **Gravação:** Uma instância do `MediaRecorder` é criada com o stream combinado. Quando a gravação inicia, os dados são coletados em "chunks".
5.  **Finalização:** Ao parar a gravação, os "chunks" são combinados em um `Blob` com o `mime-type` de `video/webm`.
6.  **Preview e Download:** Uma URL é criada a partir do `Blob` (`URL.createObjectURL`) e atribuída a um elemento `<video>` para que o usuário possa pré-visualizar a gravação. O mesmo URL é usado para criar um link de download.
