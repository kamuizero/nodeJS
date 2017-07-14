/*
 * API REST de operaciones para las clinicas
 */
const express = require('express');
const router = express.Router();
const ClinicsController = require('../public/javascripts/clinics/clinicscontroller');

router.get('/', function(req, res, next) {(
    res.send(ClinicsController.getAllClinics()));
});

router.get('/:id',function(req, res, next){
    //Obtener los datos de una sola clinica
    res.send(ClinicsController.getClinic(req.params.id));
});

router.put('/:id',function(req, res, next){
    //Actualizar clinica
    res.send(ClinicsController.updateClinic(req));
});

module.exports = router; //Necesario para habilitar las rutas