require('dotenv').config();
const http = require('http');
const https = require('https'); // <--- 1. Import ini
const httpProxy = require('http-proxy');

// PAKSA MATIKAN VALIDASI SSL SECARA GLOBAL DI LEVEL PROSES
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

const TARGET_URL = process.env.TARGET_URL;
const PORT = process.env.PORT || 3000;

if (!TARGET_URL) {
    console.error("❌ TARGET_URL is missing");
    process.exit(1);
}

// 2. Buat Agent Khusus yang 'bandel' (ignore SSL)
const secureAgent = new https.Agent({
    rejectUnauthorized: false
});

// 3. Masukkan agent ini ke config proxy
const proxy = httpProxy.createProxyServer({
    target: TARGET_URL,
    changeOrigin: true,
    secure: false, // Tetap pasang ini sebagai cadangan
    agent: secureAgent, // <--- PASANG AGENT DI SINI
});

proxy.on('error', function (err, req, res) {
    console.error('Proxy Error:', err);
    res.writeHead(500, { 'Content-Type': 'text/plain' });
    res.end('Proxy Error: ' + err.message);
});

const server = http.createServer(function (req, res) {
    console.log(`Meneruskan request: ${req.method} ${req.url}`);

    // Pastikan agent juga dipassing saat web request (untuk memastikan)
    proxy.web(req, res, {
        target: TARGET_URL,
        agent: secureAgent
    });
});

server.listen(PORT, () => {
    console.log(`Proxy berjalan di port ${PORT}, meneruskan ke ${TARGET_URL}`);
});