const express = require('express');
const router = express.Router();
const ArduinoController = require('../public/javascripts/arduinocontroller');

router.get('/', function(req, res, next) { //arduino

    /*let data = req.query.data,
        pos = req.query.pos,
        log = req.query.log;*/

    /*console.log('- ARDUINO - Valor de data es: ' + data + ' y el valor de log es: ' + log + " y el valor de pos es: " + pos);

    ArduinoController.procesarMensaje(
        {data: data,
            posicion: pos,
            log: log,
            cliente: req.ip
        });*/

    res.sendStatus(200);
});

router.get('/eventos', function(req, res, next){
    console.log('GET /eventos - Buscar todos los eventos');
    ArduinoController.leerEventos(res);
    // res.json(ArduinoController.leerEventos());
});

module.exports = router; //Necesario para habilitar las rutas