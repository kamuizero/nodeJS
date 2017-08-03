var express = require('express');
var router = express.Router();
var mongo = require('mongodb').MongoClient;
var objectID = require('mongodb').ObjectID;
var assert = require('assert'); //Se usa para hacer pruebas, validar cosas
var arduinoC = require('../public/javascripts/arduinocontroller');

const PAGE_TITLE = "MONGO DB";

var url = 'mongodb://localhost:27017/test'; //test es la base  de datos que utilizaremos

/* GET home page. */
router.get('/', function(req, res, next) {
    console.log('Cargar la pagina index');
    res.render('index', { title: PAGE_TITLE});
});

router.get('/arduino', function (req, res, next) {

    //Obtenemos los posibles valores enviados por el arduino
    var data = req.query.data,
        pos = req.query.pos,
        log = req.query.log;

    console.log('Valor de data es: ' + data + ' y el valor de log es: ' + log + " y el valor de pos es: " + pos);

    arduinoC.procesarMensaje(
        {data: data,
            posicion: pos,
            log: log,
            cliente: req.ip
        });

    res.render('index');
});

module.exports = router;