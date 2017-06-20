const url = require('url');
const fs = require('fs');

function renderHTML(path, response) {
    fs.readFile(path, null,
        function(error, data) { //error es por si acaso da algun error, y la data es el archivo
        if (error) {
            response.writeHead(404);
            response.write('File not found');
        } else {
            response.write(data);
        }
        response.end(); // Cerramos la respuesta, tiene que ser aqui para asegurarnos que sea despues de leer la data
    });
}

module.exports ={

    handleRequest: function(request, response) {
        response.writeHead(200, {'Content-Type':'text/html'});

        var path = url.parse(request.url).pathname; //Obtenemos la URL

        //Aqui hacemos el routing
        switch (path) {
            case '/' :
                renderHTML('./index.html', response);
                break;
            case '/login':
                renderHTML('./login.html', response);
                break;
            default:
                response.writeHead(404);
                response.write('Route not defined');
                response.end(); //Hay que terminar la respuesta
                break;
        }
    }

};