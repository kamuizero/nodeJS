const express = require('express');
const router = express.Router();
const OrderController = require('../public/javascripts/ordercontroller');

router.get('/', function(req, res, next){
    console.log('GET /eventos - Buscar todos los eventos');
    OrderController.leerEventos(res);
});

router.post('/', function(req, res, next) { //Insertar orden nueva

    let data = req.query.data,
        pos = req.query.pos,
        log = req.query.log;

    console.log('- ARDUINO - Valor de data es: ' + data + ' y el valor de log es: ' + log + " y el valor de pos es: " + pos);

    OrderController.procesarMensaje(
        {data: data,
            posicion: pos,
            log: log,
            cliente: req.ip
        });

    res.sendStatus(200);
});

module.exports = router; //Necesario para habilitar las rutas