const express = require('express');
const router = express.Router();
const OrderController = require('../public/javascripts/ordercontroller');
const manejadorS = require('./sockets');

router.get('/', function(req, res, next){
    console.log('GET /eventos - Buscar todos los eventos');
    OrderController.leerEventos(res);
});

router.get('/prueba', function(req, res, next){
    console.log('GET /prueba - PRUEBA para ejecutar acciones en la parte del SOCKET manager');
    //manejadorS.checkearHeartBeat(res);
    res.send(manejadorS.cantidadConexiones());
});

router.post('/', function(req, res, next) { //Insertar orden nueva

    let data = req.query.data,
        pos = req.query.pos,
        log = req.query.log;

    console.log('-A- POST : Insertar orden nueva ' + data + '  ' + log + " " + pos);

    OrderController.procesarMensaje(
        {data: data,
            posicion: pos,
            log: log,
            cliente: req.ip
        });

    res.sendStatus(200);
});

module.exports = router; //Necesario para habilitar las rutas