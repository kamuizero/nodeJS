const url = 'localhost:27017/test';
var moment = require('moment');
var mongoose = require('mongoose');
mongoose.connect(url);
var Schema = mongoose.Schema;

//Definir el esquema de la transaccion en la base de datos, esto ayuda a la validacion
var eventoArduinoSchema = new Schema ({
    tiempo: {type: String, required: true},
    cliente: String,
    evento: String,
    tipo: String
}, {collection: 'eventos-arduino'});

var EventoArduino = mongoose.model('EventoArduino', eventoArduinoSchema);

function registrarLog(evento) {

    evento[tipo] = "log";
    evento[tiempo] = moment().format('MMMM Do YYYY, h:mm:ss a');

    var data = new EventoArduino(evento);
    data.save();
    return true;
}

function registrarPosicion() {

}

function buscarEventos() {
    EventoArduino.find()
        .then( function(doc) {
            return ({items:doc});
        });
}

module.exports = {
    procesarMensaje: function (params) {

        console.log("EN PROCESAR ARDUINO: " + params.data);
        console.log(moment().format());

        /*
        var pos = params.posicion;
        var evento = {
            cliente: params.cliente,
            evento: params.evento
        };

        var data = new EventoArduino(evento);


        switch (pos) {
            case 0: //IZQUIERDA
                //fwrite($fp,  $fechaHora." - IZQUIERDA\n");
                break;
            case 2: //DERECHA
                //fwrite($fp,  $fechaHora." - DERECHA\n");
                break;
            case 5: //FRENTE
                //fwrite($fp,  $fechaHora." - FRENTE\n");
                break;
            case 6: //ATRAS
                //fwrite($fp,  $fechaHora." - ATRAS\n");
                break;
            default:
                //fwrite($fp,  $fechaHora." -ERROR- \n");
                break;
        }*/

    },

    leerEventos: function () {
        console.log("Leer elementos");
        return buscarEventos();
    }

};