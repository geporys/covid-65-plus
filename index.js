// var express = require('express');

// // создаём Express-приложение
// var app = express();

// // создаём маршрут для главной страницы
// // http://localhost:8080/
// app.get('/', function (req, res) {
//   res.sendfile('./game/level1/index.html');
//   res.sendfile('./game/level1/index.js');
// });

// // запускаем сервер на порту 8080
// app.listen(8080);
// // отправляем сообщение
// console.log('Сервер стартовал!');

var connect = require('connect');
var serveStatic = require('serve-static');

connect()
  .use(serveStatic('./game/level1'))
  .listen(8080, () => console.log('Server running on 8080...'));
