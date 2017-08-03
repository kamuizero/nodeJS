const WebSocket = require('ws');
const url = require('url');

var wss;
var conexiones = [];
var conexionesESP8266 = [];

function limpiarUsuarios() {
    if (conexiones) {
        conexiones.forEach(function (elemento) {
           if (elemento.disconnected) {
               let index = conexiones.indexOf(elemento);
               conexiones.splice(index, 1);
               console.log('Eliminado un socket');
           }
        });
    }
}

function broadcast(message) {
    conexiones.forEach(function (con, i) {
        con.send(message);
    });
}

function broadcastTodosOtros(message, scktIgnorar) {

    if (conexiones) {
        conexiones.forEach( function (conn) {
            if (conn.socket !== scktIgnorar){
                conn.socket.send(message);
            }
        });
    }
}

function enviarMensajeProcessing(message) {
    if (conexiones) {
        conexiones.forEach( function (conn) {
            if (conn.tipoCliente == 'processing') {
                conn.socket.send(message)
            }
        });
    }
}

function procesarMensaje(socket, message) {

    console.log(message);
    let msJSON = JSON.parse(message);

    switch (msJSON.tipo) {
        case 'inicio' :
            console.log('0 - Mensaje de inicio de conexion, agregarlo a la pila de conexiones');
            console.log('Contenido del mensaje: ' + msJSON.mensaje);
            let cliente = {tipoCliente : msJSON.cliente,
                ip : socket._socket.remoteAddress,
                socket : socket};

            if (cliente.tipoCliente == 'ESP8266') {
                conexionesESP8266.push(cliente);
                console.log('Cantidad de clientes ESP8266 conectados es: ' + conexionesESP8266.length + ' - y su ubicacion es: ' + socket._socket.remoteAddress);
            } else {
                conexiones.push(cliente);
                console.log('Cantidad de clientes no-ESP8266 conectados es: ' + conexiones.length + ' - y su ubicacion es: ' + socket._socket.remoteAddress);
            }

            break;
        case 'mensaje' :
            console.log('1 - Mensaje de texto');
            console.log('Contenido del mensaje: ' + msJSON.mensaje);
            broadcastTodosOtros(JSON.stringify(message),socket);
            break;
        case 'accel' :
            console.log('2 - Mensaje de accelerometro');
            console.log('X: ' + msJSON.mensaje.X);
            console.log('Y: ' + msJSON.mensaje.Y);
            console.log('Z: ' + msJSON.mensaje.Z);
            //enviar a processing
            enviarMensajeProcessing(JSON.stringify(msJSON.mensaje));
            break;
        default:
            break;
    }
}

module.exports.listen = function(server) {
    // wss = new WebSocket.Server({ server : server, path : "/rutadelsocket"});
    wss = new WebSocket.Server({ server });

    wss.on('connection', function(socket, req) {
        console.log('======== UN USUARIO SE HA CONECTADO ========');
        //const location = url.parse(req.url, true);

        socket.on('message', function incoming(message) {
            procesarMensaje(socket, message);
        });

        socket.on('close', function(){
            console.log('USUARIO se ha desconectado');
            conexiones = conexiones.filter(function (conn, index) {
                return (conn.socket !== socket);
            });
        });

        socket.send('Conexion iniciada');
    });
}
;