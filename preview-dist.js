const http = require('http');
const fs = require('fs');
const path = require('path');
const port = process.env.PORT || 4173;
const root = path.join(__dirname, 'dist');

const mime = {
  '.html': 'text/html',
  '.js': 'application/javascript',
  '.css': 'text/css',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.json': 'application/json'
};

const server = http.createServer((req, res) => {
  let reqPath = decodeURIComponent(req.url.split('?')[0]);
  if (reqPath === '/') reqPath = '/index.html';
  const filePath = path.join(root, reqPath.replace(/^\//, ''));
  if (!filePath.startsWith(root)) return res.writeHead(403).end('Forbidden');
  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) return res.writeHead(404).end('Not found');
    const ext = path.extname(filePath);
    res.writeHead(200, {'Content-Type': mime[ext] || 'application/octet-stream'});
    fs.createReadStream(filePath).pipe(res);
  });
});

server.listen(port, '127.0.0.1', () => {
  console.log(`Preview server ready at http://127.0.0.1:${port}/`);
});
