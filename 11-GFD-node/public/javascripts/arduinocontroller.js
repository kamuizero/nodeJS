const url = 'localhost:27017/test';
var moment = require('moment');
var mongoose = require('mongoose');
mongoose.connect(url);
var Schema = mongoose.Schema;
const {Client} = require('virtuoso-sparql-client');

//Definir el esquema de la transaccion en la base de datos, esto ayuda a la validacion
var eventoArduinoSchema = new Schema ({
    tiempo: {type: String, required: true},
    cliente: String,
    evento: String,
    tipo: String
}, {collection: 'eventos-arduino'});

var EventoArduino = mongoose.model('EventoArduino', eventoArduinoSchema);

function registrarLog(evento) {
    evento.tipo = "log";
    evento.tiempo = moment().format('MMMM Do YYYY, h:mm:ss a');
    var data = new EventoArduino(evento);
    data.save();
    console.log("Log insertado en MongoDB");
    return true;
}

function registrarPosicion(evento) {
    evento.tipo = "posicion";
    evento.tiempo = moment().format('MMMM Do YYYY, h:mm:ss a');

    var data = new EventoArduino(evento);
    data.save();
    console.log("Posicion insertada en MongoDB");
    return true;
}

function buscarEventos() {
    EventoArduino.find()
        .then( function(doc) {
            return ({items:doc});
        });
}

module.exports = {
    procesarMensaje: function (params) {

        var pos = params.posicion,
            log = params.log,
            data = params.data;

        var evento = {
            cliente: params.cliente,
            tipo: '',
            tiempo: ''
        };

        if (log) {
            switch (log) {
                case "1" : //Registro inicial
                    if (data == 1) {
                        evento.evento = "Iniciando Configuracion";
                        console.log(evento.evento);
                        registrarLog(evento);

                        evento.evento = "Dispositivo responde";
                        console.log(evento.evento);
                        registrarLog(evento);
                    }
                    else if (data == 0) {
                        evento.evento = "Iniciando Configuracion";
                        console.log(evento.evento);
                        registrarLog(evento);

                        evento.evento = "Dispositivo no responde";
                        console.log(evento.evento);
                        registrarLog(evento);
                    }
                    break;
                case "2" : //Configurar modo
                    if (data == 1) {
                        evento.evento = "Configurado modo de operacion a Station + SoftAP";
                        console.log(evento.evento);
                        registrarLog(evento);
                    }
                    else if (data == 0) {
                        evento.evento = "Error configurando el modo de operacion";
                        console.log(evento.evento);
                        registrarLog(evento);
                    }
                    break;
                case "3" : //Conexion
                    if (data == 1) {
                        evento.evento = "Conexion Iniciada";
                        console.log(evento.evento);
                        registrarLog(evento);
                    }
                    else if (data == 0) {
                        evento.evento = "Error de conexion";
                        console.log(evento.evento);
                        registrarLog(evento);
                    }
                    else if (data == 2) {
                        evento.evento = "El dispositivo ya esta conectado a la red";
                        console.log(evento.evento);
                        registrarLog(evento);
                    }
                    break;
                case "4" : //MUX
                    if (data == 1) {
                        evento.evento = "MUX Deshabilitado";
                        console.log(evento.evento);
                        registrarLog(evento);
                    }
                    else if (data == 0) {
                        evento.evento = "Error de deshabilitacion del MUX";
                        console.log(evento.evento);
                        registrarLog(evento);
                    }
                    break;
                case "5" : //Fin de configuracion
                    evento.evento = "Configuracion finalizada";
                    console.log(evento.evento);
                    registrarLog(evento);
                    break;
                default:
                    console.log("Default - Data recibida no se pudo procesar, valor de  log es: " + log);
                    break;
            }
        }
        else if (pos) { //Acelerometro
            switch (pos) {
                case "0": //IZQUIERDA
                    evento.evento = "izquierda";
                    console.log(evento.evento);
                    registrarPosicion(evento);
                    break;
                case "2": //DERECHA
                    evento.evento = "derecha";
                    console.log(evento.evento);
                    registrarPosicion(evento);
                    break;
                case "5": //FRENTE
                    evento.evento = "frente";
                    console.log(evento.evento);
                    registrarPosicion(evento);
                    break;
                case "6": //ATRAS
                    evento.evento = "atras";
                    console.log(evento.evento);
                    registrarPosicion(evento);
                    break;
                default:
                    console.log("Error al leer la data recibida");
                    break;
            }
        }
    },

    leerEventos: function () {
        console.log("Leer elementos");
        return buscarEventos();
    },

    querySparql: function (res) {
    //Procedimiento que solamente lee los datos del endpoint
    let virtuosoLocal = new Client("http://127.0.0.1:8890/sparql");
    virtuosoLocal.setDefaultFormat('application/json');

    var consulta = "select * from <http://lod.mdg/> " +
        "where {?clinica ?atributo ?valor. " +
        " FILTER(!strstarts(str(?clinica), str(\"http://linkdata.org/property/\")) && str(?clinica) != <>) } " +
        " ORDER BY DESC(?clinica) LIMIT 200";

    virtuosoLocal.query(consulta)
        .then((results)=> {
            console.log(results);
            res.render('index', {data: results});
        })
        .catch( res.render('error') );

    console.log('Finalizo SPARQL');
    }

};