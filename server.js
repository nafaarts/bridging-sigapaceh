require('dotenv').config();

const http = require('http');
const httpProxy = require('http-proxy');

const TARGET_URL = process.env.TARGET_API;

const proxy = httpProxy.createProxyServer({});

proxy.on('error', function (err, req, res) {
    console.error('Proxy Error:', err);
    res.writeHead(500, {
        'Content-Type': 'text/plain'
    });
    res.end('Something went wrong. And we are reporting a custom error message.');
});

// Event ini berguna jika Anda ingin melihat/logging body yang lewat (opsional)
proxy.on('proxyReq', function (proxyReq, req, res, options) {
    // Header asli diteruskan otomatis, tapi Anda bisa menambah custom header di sini
    proxyReq.setHeader('X-Special-Proxy', 'NodeJS-Proxy');
});

const server = http.createServer(function (req, res) {
    console.log(`Meneruskan request: ${req.method} ${req.url}`);

    // FUNGSI UTAMA: Meneruskan (pipe) request ke target
    // changeOrigin: true dibutuhkan jika target menggunakan Virtual Hosting (vhost)
    proxy.web(req, res, {
        target: TARGET_URL,
        changeOrigin: true,
        secure: false  // <--- TAMBAHKAN INI (Bypass SSL Validation)
    });
});

console.log(`Proxy server berjalan di port 3000, meneruskan ke ${TARGET_URL}`);
server.listen(3000);