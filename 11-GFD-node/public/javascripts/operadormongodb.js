const url = 'localhost:27017/test';
//var moment = require('moment');
var mongoose = require('mongoose');
mongoose.connect(url);
var Schema = mongoose.Schema;

//Definir el esquema de la transaccion en la base de datos, esto ayuda a la validacion
var eventoArduinoSchema = new Schema ({
    id : {type: Number, required: true}, //id y label son iguales
    name: {type: String, required:true},
    address: {type: String, required:true},
    lat: Number,
    long: Number,
    label: String, //label y id osn iguales, label es en Virtuoso
    doctorSpeaksEnglishTrue: {type: Number, required: true},
    doctorSpeaksEnglishFalse: {type: Number, required: true},
    doctorSpeaksChineseTrue : {type: Number, required: true},
    doctorSpeaksChineseFalse: {type: Number, required: true},
    doctorSpeaksKoreanTrue: {type: Number, required: true},
    doctorSpeaksKoreanFalse: {type: Number, required: true},
    doctorSpeaksSpanishTrue: {type: Number, required: true},
    doctorSpeaksSpanishFalse: {type: Number, required: true},
    doctorSpeaksOtherTrue: {type: Number, required: true},
    doctorSpeaksOtherFalse: {type: Number, required: true},

    staffSpeaksEnglishTrue : {type: Number, required: true},
    staffSpeaksEnglishFalse : {type: Number, required: true},
    staffSpeaksChineseTrue: {type: Number, required: true},
    staffSpeaksChineseFalse: {type: Number, required: true},
    staffSpeaksKoreanTrue: {type: Number, required: true},
    staffSpeaksKoreanFalse: {type: Number, required: true},
    staffSpeaksSpanishTrue: {type: Number, required: true},
    staffSpeaksSpanishFalse: {type: Number, required: true},
    staffSpeaksOtherTrue: {type: Number, required: true},
    staffSpeaksOtherFalse: {type: Number, required: true},

    FriendlyLV1: {type: Number, required: true},
    FriendlyLV2: {type: Number, required: true},
    FriendlyLV3: {type: Number, required: true},

    ForeignLanguageExplanationTrue : {type: Number, required: true},
    ForeignLanguageExplanationFalse : {type: Number, required: true},
}, {collection: 'clinic'});

var EventoArduino = mongoose.model('Clinica', eventoArduinoSchema);

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

function buscarClinicas() {
    EventoArduino.find()
        .then( function(doc) {
            return ({items:doc});
        });
}

module.exports = {

    leerEventos: function () {
        console.log("Leer clinicas");
        return buscarClinicas();
    }

};