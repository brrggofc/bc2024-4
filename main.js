const { Command } = require('commander');
const http = require('http');
const fs = require('fs');
const path = require('path');

const program = new Command();

program
  .requiredOption('-h, --host <host>', 'адреса сервера')
  .requiredOption('-p, --port <port>', 'порт сервера')
  .requiredOption('-c, --cache <cache>', 'шлях до директорії кешу')
  .parse(process.argv);

const options = program.opts();

// Перевірка існування директорії кешу
if (!fs.existsSync(options.cache)) {
  console.log(`Директорія ${options.cache} не існує, створюємо...`);
  fs.mkdirSync(options.cache, { recursive: true }); // Створює директорію, якщо її немає
}

console.log(`Сервер запуститься на http://${options.host}:${options.port}, кеш: ${options.cache}`);

// Ваш код для запуску сервера тут
const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('Сервер працює');
});

server.listen(options.port, options.host, () => {
  console.log(`Сервер запущено на http://${options.host}:${options.port}`);
});
