# Laboratório de Teste de Carga com Docker

![Status](https://img.shields.io/badge/status-concluído-green)
![Tecnologia](https://img.shields.io/badge/tecnologia-Docker%20%7C%20Node.js%20%7C%20NGINX-blue)

Este repositório contém um ambiente de teste de carga autocontido, projetado para fins educacionais. Ele consiste em duas aplicações containerizadas:

1.  **Requester App**: Uma aplicação em Node.js que envia um número configurável de requisições HTTP por segundo para um alvo.
2.  **Target Server**: Um servidor web NGINX simples que atua como o alvo para os requests, com um limite de consumo de memória.

O objetivo é simular um cenário de teste de carga (ou stress test) de forma segura e local, permitindo observar o comportamento de um serviço sob alta demanda e entender os conceitos de orquestração de containers com Docker Compose.

> ### ⚠️ Aviso de Responsabilidade
> Esta ferramenta foi criada **exclusivamente para fins educacionais e de teste em ambientes locais e controlados**. A utilização deste projeto contra qualquer servidor ou DNS do qual você não seja o proprietário ou não tenha permissão explícita para testar é **ilegal, antiética e pode ser caracterizada como um ataque de Negação de Serviço (DoS)**. Use com responsabilidade.

---

## 🏗️ Arquitetura do Projeto

O ambiente é dividido em dois serviços principais, cada um gerenciado pelo seu próprio `docker-compose.yml`:

| Serviço                 | Descrição                                                                                                  | Tecnologia      |
| ----------------------- | ---------------------------------------------------------------------------------------------------------- | --------------- |
| **Requester App** | Um cliente que entra em um loop infinito, disparando `N` requests por segundo para o servidor alvo.          | Node.js, Axios  |
| **Target Server (Alvo)** | Um servidor web leve para receber os requests. Possui um limite de **128MB de RAM** configurado via Docker. | NGINX (Alpine)  |

Ambos os serviços se comunicam através de uma rede Docker customizada (`test-net`), permitindo que a aplicação cliente encontre o servidor alvo usando seu nome de container (`nginx-target-server`) como um DNS.

### 📁 Estrutura de Diretórios
``` bash
.
├── requester_app/
│   ├── Dockerfile             # Define a imagem da aplicação Node.js
│   ├── docker-compose.yml     # Orquestra o container do 'requester'
│   ├── package.json           # Dependências Node.js
│   └── app.js                 # O código que envia os requests
└── target_nginx/
├── docker-compose.yml     # Orquestra o container do NGINX (alvo)
└── nginx/
└── html/
└── index.html     # Página web simples servida pelo NGINX
```

---

## 🚀 Como Executar

### Pré-requisitos
* [Docker](https://www.docker.com/get-started/)
* [Docker Compose](https://docs.docker.com/compose/install/) (geralmente já vem com o Docker Desktop)

### Passo a Passo

1.  **Clone este repositório:**
    ```bash
    git clone <URL_DO_SEU_REPOSITORIO>
    cd stress-test-lab
    ```

2.  **Inicie o Servidor Alvo (NGINX):**
    Este comando irá construir e iniciar o container do NGINX em segundo plano (`-d`).
    ```bash
    cd target_nginx
    docker-compose up -d
    ```
    Para verificar se o servidor está no ar, acesse `http://localhost:8080` no seu navegador ou execute:
    ```bash
    curl http://localhost:8080
    ```
    Você deverá ver o conteúdo do arquivo `index.html`.

3.  **Inicie a Aplicação de Requisições:**
    Este comando irá construir a imagem da aplicação Node.js (`--build`) e iniciá-la. A aplicação começará imediatamente a enviar requests para o servidor NGINX.
    ```bash
    cd ../requester_app
    docker-compose up --build
    ```

4.  **Observe os Logs:**
    O terminal onde você executou o último comando exibirá os logs em tempo real, mostrando cada request enviado, seu status e a latência.
    ```
    Iniciando o loop de requisições...
    Alvo: http://nginx-target-server
    Taxa: 10 requests por segundo (1 request a cada 100.00ms)
    --------------------------------------------------
    Request #1 enviado com sucesso para http://nginx-target-server (duração: 5ms)
    Request #2 enviado com sucesso para http://nginx-target-server (duração: 3ms)
    ...
    ```

---

## ⚙️ Configuração

Você pode facilmente alterar a intensidade do teste modificando as variáveis de ambiente no arquivo `requester_app/docker-compose.yml`.

```yaml
# requester_app/docker-compose.yml
services:
  requester-app:
    # ...
    environment:
      # Altere o valor abaixo para aumentar ou diminuir a carga
      - REQUESTS_PER_SECOND=20 # Exemplo: 20 requests por segundo
Após alterar o valor, reinicie o serviço requester-app com o passo 3 para aplicar as mudanças.
```


## 🛑 Parando o Ambiente
Para parar todos os containers e remover a rede criada, execute os seguintes comandos nos seus respectivos diretórios:

Pare a aplicação de requisições:
No diretório requester_app/, pressione Ctrl + C (se estiver em execução) e depois:

```bash
docker-compose down
```

Pare o servidor alvo:

No diretório target_nginx/:

```bash
docker-compose down
```
Isso garante que seu ambiente Docker fique limpo.


Para instalar o Docker localmente ...
```bash
wsl --install
```
e Depois ...

```bash
Invoke-WebRequest -Uri "https://desktop.docker.com/win/main/amd64/Docker%20Desktop%20Installer.exe" -OutFile "$env:USERPROFILE\Downloads\DockerDesktopInstaller.exe"
```