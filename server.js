import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = process.env.PORT || 8080;
const DIR = __dirname;

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.woff2': 'font/woff2',
  '.woff': 'font/woff',
  '.ttf': 'font/ttf'
};

const server = http.createServer((req, res) => {
  let reqPath = decodeURI(req.url.split('?')[0]);
  if (reqPath === '/' || reqPath === '/index.html') {
    // If requested root, serve moeys_primary_school_system.html
    reqPath = '/moeys_primary_school_system.html';
  }

  const filePath = path.join(DIR, reqPath);

  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      const fallbackPath = path.join(DIR, 'moeys_primary_school_system.html');
      fs.readFile(fallbackPath, (fbErr, content) => {
        if (fbErr) {
          res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
          res.end('404 Not Found');
        } else {
          res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
          res.end(content);
        }
      });
      return;
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    fs.readFile(filePath, (readErr, data) => {
      if (readErr) {
        res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
        res.end('500 Server Error: ' + readErr.message);
      } else {
        res.writeHead(200, {
          'Content-Type': contentType,
          'Access-Control-Allow-Origin': '*'
        });
        res.end(data);
      }
    });
  });
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running at http://localhost:${PORT}/`);
  console.log(`Open http://localhost:${PORT}/ in your browser.`);
});
