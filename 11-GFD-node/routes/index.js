const express = require('express');
const router = express.Router();
//const mongo = require('mongodb').MongoClient;
//const objectID = require('mongodb').ObjectID;
const assert = require('assert'); //Se usa para hacer pruebas, validar cosas

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

module.exports = router;