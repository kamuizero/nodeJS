const WebSocket = require('ws');
var moment = require('moment');
const url = require('url');
const schedule = require('node-schedule');

let wss;
let conexiones = [];
let conexionesESP8266 = [];

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

function limpiarConexionesESP() {
    if (conexionesESP8266) {
        conexionesESP8266.forEach(function (elemento) {
            if (elemento.socket.readyState === WebSocket.CLOSED) {
                let index = conexionesESP8266.indexOf(elemento);
                conexionesESP8266.splice(index, 1);
                console.log('--- Eliminado un ESP8266 ---');
            }
        });
    }
}

function eliminarConexionesESP() {
    if (conexionesESP8266) {
        conexionesESP8266.forEach(function (elemento) {
            if (elemento.alive === false) {
                let index = conexionesESP8266.indexOf(elemento);
                conexionesESP8266.splice(index, 1);
                console.log('--- Eliminado un ESP8266 ---');
            }
        });
    }
}

function broadcastOrder(socket, message) {
    conexiones.forEach(function (conn) {
        conn.socket.send(
            moment().format('MMMM Do YYYY, h:mm:ss a') +
            ' - ' +
            message +
            ' - IP: ' +
            socket._socket.remoteAddress);
    });
}

function broadcast(message) {
    conexiones.forEach(function (conn) {
        conn.socket.send(message);
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
            let cliente = {
                tipoCliente : msJSON.cliente,
                ip : socket._socket.remoteAddress,
                alive : true,
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
            // broadcastTodosOtros(JSON.stringify(message),socket);
            broadcastTodosOtros(msJSON.mensaje,socket);
            break;
        case 'accel' :
            console.log('2 - Mensaje de accelerometro');
            console.log('X: ' + msJSON.mensaje.X);
            console.log('Y: ' + msJSON.mensaje.Y);
            console.log('Z: ' + msJSON.mensaje.Z);
            //enviar a processing
            enviarMensajeProcessing(JSON.stringify(msJSON.mensaje));
            break;
        case 'orden' :
            console.log('3 - Oden del sistema');
            console.log('Posicion: ' + msJSON.mensaje.posicion);
            broadcastOrder(socket, msJSON.mensaje.posicion);
            //Aqui guardarlo en BD o mandarlo por WS a las interfaces de visualizacion
            break;
        case 'heartbeat' :
            console.log('4 - Confirmacion de heartbeat');

            if (msJSON.mensaje === 'alive') {
                console.log('Conexion viva en la IP ' + socket._socket.remoteAddress);

                //Ahora buscar en las conexiones ESP8266 cual tiene este socket, actualizar el alive a TRUE
                if (conexionesESP8266) {
                    conexionesESP8266.forEach(function (elemento) {
                        if (elemento.socket === socket) { //Si esta conexion es la del socket, actualizarlo
                            elemento.alive = true;
                            console.log('--- SET ALIVE  ---');
                        }
                    });
                }

            } else {
                console.log('Ocurrio algun error');
            }
            //Aqui guardarlo en BD o mandarlo por WS a las interfaces de visualizacion
            break;
        default:
            break;
    }
}

module.exports.listen = function(server) {
    // wss = new WebSocket.Server({ server : server, path : "/rutadelsocket"});
    wss = new WebSocket.Server({ server });

    function heartbeat() {
        this.isAlive = true;
    }

    wss.on('connection', function(socket, req) {
        console.log('======== UN USUARIO SE HA CONECTADO ========');
        //const location = url.parse(req.url, true);

        socket.isAlive = true;

        socket.on('message', function incoming(message) {
            procesarMensaje(socket, message);
        });

        socket.on('close', function(){
            console.log('USUARIO se ha desconectado');
            conexiones = conexiones.filter(function (conn, index) {
                return (conn.socket !== socket);
            });
        });

        socket.on('pong', heartbeat);
        socket.send('Conexion iniciada');
    });

    //setInterval(limpiarConexionesESP,20000);

    const interval = setInterval(function ping() {

        //La funcion va a verificar cada 30 segundos

        if (conexionesESP8266) {
            conexionesESP8266.forEach(function (conn) {
                console.log(moment().format('MMMM Do YYYY, h:mm:ss a') + ' - Enviando Mensaje heartbeat a dispositivo');

                if (conn.socket.readyState === WebSocket.CLOSED) {
                    console.log('CONEXION MUERTA');
                    let index = conexionesESP8266.indexOf(conn);
                    conexionesESP8266.splice(index, 1);
                    console.log('--- Eliminado un ESP8266 ---');
                } else {
                    conn.socket.send('heartbeat');
                }

            });
        }

        /*conexionesESP8266.forEach( function each (ws) {
            console.log('Checkear conexion ESP8266 muerta o viva - ' + ws.tipoCliente + ' - IP - ' + ws.ip);

            if (ws.socket.isAlive === false) {
                console.log('CONEXION MUERTA');
                return ws.terminate();
            }

            ws.isAlive = false;
            ws.socket.ping('', false, true);
        });*/

        conexiones.forEach( function each (ws) {
            console.log('Checkear conexion muerta o viva - ' + ws.tipoCliente + ' - IP - ' + ws.ip);

            if (ws.socket.isAlive === false) {
                console.log('CONEXION MUERTA');
                return ws.terminate();
            }

            ws.isAlive = false;
            ws.socket.ping('', false, true);
        });
    }, 15000);
};

module.exports.checkearHeartBeat = function (response) {
    let variable = {
        texto : 'Aurelio'
    };
    response.send(variable);
    console.log('SE ENVIO');
};

module.exports.cantidadConexiones = function() {

    let tamano = {
        conexiones : 0
    };

    if (conexionesESP8266) {
        tamano.conexiones = conexionesESP8266.length;
    }

    return tamano;
};