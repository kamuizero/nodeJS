/*
 * API REST de operaciones para las clinicas
 */
const express = require('express');
const router = express.Router();
const ClinicsController = require('../public/javascripts/clinics/clinicscontroller');

router.get('/', function(req, res, next) {
    //res.send(ClinicsController.getAllClinics());
    ClinicsController.getAllClinicsMSQL(req, res); //MySQL
});

router.post('/', function(req, res, next) {
    //res.send(ClinicsController.insertClinic(req));
    //res.send(ClinicsController.insertClinicMDB(req));
    ClinicsController.insertClinicMSQL(req, res); //MySQL
});

router.get('/:id',function(req, res, next){
    //Obtener los datos de una sola clinica
    res.send(ClinicsController.getClinic(req.params.id));
});

router.put('/:id',function(req, res, next){
    //Actualizar clinica
    //res.send(ClinicsController.updateClinic(req));
    ClinicsController.updateClinicMSQL(req, res); //MySQL
});

module.exports = router; //Necesario para habilitar las rutas