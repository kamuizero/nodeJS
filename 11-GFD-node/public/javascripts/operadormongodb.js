const url = 'localhost:27017/test';
//var moment = require('moment');
var mongoose = require('mongoose');
mongoose.connect(url);
var Schema = mongoose.Schema;
var assert = require('assert'); //Se usa para hacer pruebas, validar cosas

//Definir el esquema de la transaccion en la base de datos, esto ayuda a la validacion
var clinicaSchema = new Schema ({
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

var ClinicaModel = mongoose.model('Clinica', clinicaSchema);

function insert(clc) {
    //Primero creamos un objeto que contenga la informacion de la clinica tal como el objeto a guardar en la base de datos

    clc.tipo = "log";
    clc.tiempo = moment().format('MMMM Do YYYY, h:mm:ss a');

    //Luego, hacemos un objeto que cumpla con el esquema de MongoDB y guardamos en BD
    let data = new ClinicaModel(clc);
    data.save();
    console.log("Log insertado en MongoDB");

    return true;
}

function registrarPosicion(evento) {
    evento.tipo = "posicion";
    evento.tiempo = moment().format('MMMM Do YYYY, h:mm:ss a');

    let data = new EventoArduino(evento);
    data.save();
    console.log("Posicion insertada en MongoDB");
    return true;
}

function buscarClinicas() {
    ClinicaModel.find()
        .then( function(doc) {
            return ({items:doc});
        });
}

function getMaxClinicID() {
    let id;

    return id;
}

module.exports = {

    leerEventos: function () {
        console.log("Leer clinicas");
        return buscarClinicas();
    },

    insertClinic : function(clc) {
        console.log("Insertar Clinica");
        console.log(clc);
        //return insert(clc);
        return true;
    },

    getMaxID : function() {
        //Llamar al procedimiento

        console.log("A buscar el ID...");

        /* CODIGO INICIAL QUE AL PARECER FALLO
        ClinicaModel.findOne().sort('-id').exec(function (err, item) {
            console.log("EL MAXIMO ID ES: " + item.id);
        });*/

        //Codigo basado en la pagina de Mongoose

        //var query = ClinicaModel.findOne().sort('-id');
        var query = ClinicaModel.findOne();
        mongoose.Promise = global.Promise;

        assert.equal(query.exec().constructor, global.Promise);

        query.then(function (doc) {
            console.log(doc);
            console.log("EL MAXIMO ID ES: " + doc.id);
        });

        console.log('Finalizo el buscar ID');
    }

};