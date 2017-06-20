const http = require('http');
const fs = require('fs');

function onRequest(request, response) {
    response.writeHead(200, {'Content-Type':'text/html'}); //Indicamos que la respuesta debe ser en HTML
    // response.write('index.html');
    fs.readFile('./index.html', null, function(error, data) { //error es por si acaso da algun error, y la data es el archivo
        if (error) {
            response.writeHead(404);
            response.write('File not found');
        } else {
            response.write(data);
        }
        response.end(); // Cerramos la respuesta, tiene que ser aqui para asegurarnos que sea despues de leer la data
    });
}

http.createServer(onRequest).listen(8000);