const express = require('express');
const router = express.Router();
//const mongo = require('mongodb').MongoClient;
//const objectID = require('mongodb').ObjectID;
const assert = require('assert'); //Se usa para hacer pruebas, validar cosas
const CSV = require('../public/scripts/csvinsert');

const PAGE_TITLE = "外国人フレンドリークリニック集 - Foreigner Friendly Clinic Directory";
//const url = 'mongodb://localhost:27017/test'; //test es la base  de datos que utilizaremos

/* GET home page. */
router.get('/', function(req, res, next) {
    let parametros = {
        title : PAGE_TITLE
    };
    res.render('index', parametros);
});

router.get('/about', function(req, res, next) {
    let parametros = {
        title : PAGE_TITLE
    };
    res.render('about',parametros);
});

router.get('/review',function(req, res, next){
    //Aqui cargamos la clinica
    let parametros = {
        title : PAGE_TITLE
    };
    res.render('clinicreview', parametros);
});

router.get('/create',function(req, res, next){
    //Aqui cargamos la clinica
    let parametros = {
        title : PAGE_TITLE
    };
    res.render('createclinic', parametros);
});

router.get('/csv',function(req, res, next){
    //Aqui vamos a procesar el csv
    // let ruta = 'http://www.city.nisshin.lg.jp/dbps_data/_material_/_files/000/000/021/926/23230_iryoukikan.csv';
    let ruta = 'C:\\Users\\AEPM\\Desktop\\23230_iryoukikan.csv';
    CSV.cargarCSV(ruta);
    res.sendStatus(200); //Si la operacion sale bien
});

module.exports = router;