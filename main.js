const http = require('http');
const fs = require('fs');
const path = require('path');

// Отримуємо параметри командного рядка (хост, порт, шлях до кешу)
const options = {
  host: '127.0.0.1',
  port: 3000,
  cache: './cache', // Шлях до кешу
};

// Створення директорії кешу, якщо її не існує
if (!fs.existsSync(options.cache)) {
  console.log('Директорія ./cache не існує, створюємо...');
  fs.mkdirSync(options.cache);
}

const server = http.createServer(async (req, res) => {
  const urlPath = req.url.slice(1); // Отримуємо HTTP-код із URL (наприклад, "200")
  const cachePath = path.join(options.cache, `${urlPath}.jpg`);

  try {
    if (req.method === 'GET') {
      // GET: Читання файлу з кешу
      try {
        const data = await fs.promises.readFile(cachePath);
        res.writeHead(200, { 'Content-Type': 'image/jpeg' });
        res.end(data);
      } catch (error) {
        if (error.code === 'ENOENT') {
          res.writeHead(404, { 'Content-Type': 'text/plain' });
          res.end('Картинка не знайдена у кеші');
        } else {
          throw error;
        }
      }
    } else if (req.method === 'PUT') {
      // PUT: Запис файлу в кеш
      const chunks = [];
      req.on('data', chunk => chunks.push(chunk));
      req.on('end', async () => {
        await fs.promises.writeFile(cachePath, Buffer.concat(chunks));
        res.writeHead(201, { 'Content-Type': 'text/plain' });
        res.end('Картинка успішно записана в кеш');
      });
    } else if (req.method === 'DELETE') {
      // DELETE: Видалення файлу з кешу
      try {
        await fs.promises.unlink(cachePath);
        res.writeHead(200, { 'Content-Type': 'text/plain' });
        res.end('Картинка успішно видалена з кешу');
      } catch (error) {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('Картинка не знайдена для видалення');
      }
    } else {
      // Метод не дозволено
      res.writeHead(405, { 'Content-Type': 'text/plain' });
      res.end('Метод не дозволено');
    }
  } catch (error) {
    res.writeHead(500, { 'Content-Type': 'text/plain' });
    res.end('Внутрішня помилка сервера');
  }
});

// Запуск сервера
server.listen(options.port, options.host, () => {
  console.log(`Сервер запущено на http://${options.host}:${options.port}`);
});
