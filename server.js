const http = require('http');
const httpProxy = require('http-proxy');
require('dotenv').config();

const TARGET_URL = process.env.TARGET_URL;
const PORT = process.env.PORT || 3000;

if (!TARGET_URL) {
    console.error("❌ TARGET_URL is missing");
    process.exit(1);
}

const proxy = httpProxy.createProxyServer({
    target: TARGET_URL,
    changeOrigin: true,
});

proxy.on('error', function (err, req, res) {
    console.error('Proxy Error:', err);
    res.writeHead(500, { 'Content-Type': 'text/plain' });
    res.end('Proxy Error: ' + err.message);
});

const server = http.createServer(function (req, res) {
    console.log(`Meneruskan request: ${req.method} ${req.url}`);

    proxy.web(req, res, {
        target: TARGET_URL,
    });
});

server.listen(PORT, () => {
    console.log(`Proxy berjalan di port ${PORT}, meneruskan ke ${TARGET_URL}`);
});