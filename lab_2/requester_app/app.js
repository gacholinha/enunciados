const axios = require('axios');

// Pega as configurações das variáveis de ambiente
const targetDns = process.env.TARGET_DNS;
const requestsPerSecond = parseInt(process.env.REQUESTS_PER_SECOND, 10);

if (!targetDns || !requestsPerSecond || isNaN(requestsPerSecond) || requestsPerSecond <= 0) {
    console.error("ERRO: Variáveis de ambiente TARGET_DNS e/ou REQUESTS_PER_SECOND não foram definidas corretamente.");
    console.error("Exemplo: TARGET_DNS=http://localhost:8080 REQUESTS_PER_SECOND=10");
    process.exit(1);
}

// Calcula o intervalo em milissegundos para atingir N requests por segundo.
// Se N=10, o intervalo é 1000ms / 10 = 100ms.
const interval = 1000 / requestsPerSecond;

console.log(`Iniciando o loop de requisições...`);
console.log(`Alvo: ${targetDns}`);
console.log(`Taxa: ${requestsPerSecond} requests por segundo (1 request a cada ${interval.toFixed(2)}ms)`);
console.log('--------------------------------------------------');

let requestCount = 0;

const sendRequest = async () => {
    try {
        const startTime = Date.now();
        await axios.get(targetDns);
        const endTime = Date.now();
        requestCount++;
        console.log(`Request #${requestCount} enviado com sucesso para ${targetDns} (duração: ${endTime - startTime}ms)`);
    } catch (error) {
        console.error(`Falha ao enviar request para ${targetDns}: ${error.message}`);
    }
};

// Inicia o loop infinito que chama a função sendRequest na frequência definida
setInterval(sendRequest, interval);