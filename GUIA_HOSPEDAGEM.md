# Guia de Hospedagem: Publicando seu Gravador de Tela na Internet

Este guia irá orientá-lo sobre como hospedar seu projeto de gravador de tela online. A melhor parte é que, para um projeto como este (que usa apenas HTML, CSS e JavaScript), você pode fazer isso de graça.

## Entendendo o Projeto: Um Site Estático

Seu projeto é o que chamamos de **site estático**. Isso significa que ele é composto apenas por arquivos que não mudam (HTML, CSS, JS, imagens). Ele não precisa de um "servidor" no sentido tradicional (como Node.js, Python, PHP ou um banco de dados) para funcionar. O navegador do usuário faz todo o trabalho.

Isso torna a hospedagem muito mais simples e barata (muitas vezes, gratuita).

---

## Opções Gratuitas (Recomendado)

Existem várias plataformas excelentes que oferecem hospedagem gratuita para sites estáticos. Elas são rápidas, seguras e fáceis de usar.

1.  **GitHub Pages**: A opção mais natural se o seu código já está ou estará no GitHub. É totalmente integrado ao fluxo de trabalho do Git.
2.  **Netlify**: Incrivelmente fácil de usar. Famoso por seu recurso de "arrastar e soltar" (drag-and-drop) para publicar um site em segundos.
3.  **Vercel**: Outra plataforma moderna e muito popular, com um excelente plano gratuito. É a criadora do framework Next.js, mas é perfeita para qualquer site estático.
4.  **Cloudflare Pages**: Focada em performance, distribui seu site globalmente através de uma CDN (Rede de Distribuição de Conteúdo) para que ele carregue rapidamente em qualquer lugar do mundo.

**Recomendação para você:** Comece com o **GitHub Pages**. É a maneira mais direta e didática de hospedar um projeto que vive em um repositório Git.

---

## Passo a Passo: Hospedando com GitHub Pages

Vamos usar o GitHub Pages como nosso exemplo. O processo é simples.

### Pré-requisitos

1.  **Conta no GitHub:** Se você não tiver uma, crie em [github.com](https://github.com).
2.  **Git instalado:** Você precisa do Git na sua máquina para enviar os arquivos.

### Passos

**1. Crie um Repositório no GitHub**

*   Vá para o GitHub e crie um novo repositório. Dê a ele um nome como `gravador-de-tela`.
*   Pode ser público ou privado. O GitHub Pages funciona em ambos.

**2. Envie seu Código para o Repositório**

*   Abra um terminal ou prompt de comando na pasta do seu projeto (`C:\Temp\_adriano\Projetos\GIT - gravar_tela_webcam_mic-main\gravar_tela_webcam_mic`).
*   Execute os seguintes comandos, substituindo a URL pela URL do seu repositório:

    ```bash
    # Inicia um repositório Git local (se ainda não fez isso)
    git init

    # Adiciona todos os arquivos para o Git
    git add .

    # Cria o primeiro "commit" (um registro das suas alterações)
    git commit -m "Versão inicial do projeto"

    # Define o nome do branch principal como "main"
    git branch -M main

    # Conecta seu repositório local ao repositório remoto no GitHub
    git remote add origin https://github.com/SEU-USUARIO/SEU-REPOSITORIO.git

    # Envia os arquivos
    git push -u origin main
    ```

**3. Ative o GitHub Pages**

*   No seu repositório no GitHub, vá para a aba **"Settings"** (Configurações).
*   No menu lateral esquerdo, clique em **"Pages"**.
*   Na seção "Build and deployment", em **"Source"**, selecione **"Deploy from a branch"**.
*   Em **"Branch"**, selecione `main` e a pasta `/root`. Clique em **"Save"**.

**4. Acesse seu Site!**

*   Aguarde um ou dois minutos. O GitHub irá construir e publicar seu site.
*   A página irá recarregar e mostrar uma caixa verde com a URL do seu site publicado, algo como:
    `https://SEU-USUARIO.github.io/gravador-de-tela/`

Pronto! Seu gravador de tela agora está online e acessível para qualquer pessoa.

---

## Alternativa Paga (Não necessário para este projeto)

Você perguntou sobre a opção mais barata caso a gratuita não existisse. Para um site estático, as opções gratuitas são tão boas (ou até melhores) que as pagas. Você só precisaria de um servidor pago se seu projeto crescesse para precisar de um **backend** (lógica no servidor, banco de dados, etc.).

Se esse fosse o caso, as opções mais em conta seriam:

*   **Hospedagem de Sites Compartilhada (Shared Hosting):** Hostinger, Hostgator, etc. Custam a partir de R$ 10-15 por mês. São fáceis de usar, mas menos flexíveis.
*   **VPS (Virtual Private Server):** DigitalOcean, Vultr, Linode. Oferecem servidores virtuais a partir de **$4 a $6 dólares por mês**. Isso lhe dá controle total, mas exige conhecimento técnico para configurar e manter o servidor (instalar Nginx/Apache, configurar segurança, etc.).

**Conclusão:** Para este projeto, fique com as opções gratuitas. Elas são mais do que suficientes e a prática de usá-las é uma habilidade valiosa para qualquer desenvolvedor web.
