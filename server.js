const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3000;
const ROOT = __dirname;

const MIME = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'application/javascript',
  '.json': 'application/json',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.webp': 'image/webp',
  '.woff2': 'font/woff2'
};

const server = http.createServer((req, res) => {
  let reqPath = decodeURI(req.url.split('?')[0]);
  if (reqPath === '/') reqPath = '/index.html';
  const filePath = path.join(ROOT, reqPath);

  if (!filePath.startsWith(ROOT)) {
    res.writeHead(403);
    res.end('Forbidden');
    return;
  }

  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('Not Found');
      return;
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME[ext] || 'application/octet-stream';
    console.log(`[200] ${req.url}`);
    
    // Disable caching for HTML, CSS, JS to guarantee instant updates on browser refresh
    const isCodeFile = ext === '.html' || ext === '.js' || ext === '.css';
    const cacheHeader = isCodeFile
      ? 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0'
      : 'public, max-age=3600';

    res.writeHead(200, {
      'Content-Type': contentType,
      'Cache-Control': cacheHeader,
      'Pragma': isCodeFile ? 'no-cache' : 'public',
      'Expires': isCodeFile ? '0' : new Date(Date.now() + 3600000).toUTCString()
    });
    fs.createReadStream(filePath).pipe(res);
  });
});

server.listen(PORT, '127.0.0.1', () => {
  console.log(`Server running at http://127.0.0.1:${PORT}`);
});
