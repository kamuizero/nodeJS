const http = require('http');
const app =require('./app');

http.createServer(app.handleRequest).listen(8000); //La funcion de createServer siempre es sin parentesis