const express = require('express');
const router = express.Router();
const mongo = require('mongodb').MongoClient;
const objectID = require('mongodb').ObjectID;
const assert = require('assert'); //Se usa para hacer pruebas, validar cosas

const PAGE_TITLE = "外国人フレンドリークリニック集 - Foreigner Friendly Clinic Directory";
const url = 'mongodb://localhost:27017/test'; //test es la base  de datos que utilizaremos

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

router.get('/get-data', function(req, res, next) {
    var resultArray = [];
    mongo.connect(url, function (err, db) {
        assert.equal(err, null);
        var cursor = db.collection('user-data').find(); //Me trae todos los  registros

        cursor.forEach(function (doc, err) {
           assert.equal(null, err);
           resultArray.push(doc);
        }, function () {//Callback una vez se lean todos los elementos
            db.close();
            res.render('index', {title: PAGE_TITLE, items: resultArray});
        });
    })
});

router.post('/insert', function (req, res, next) {
    var elemento = {
        titulo : req.body.title,
        contenido : req.body.content,
        autor : req.body.author
    };

    mongo.connect(url, function (err, db) {
        assert.equal(null, err); //Verificamos que no haya erorres

        db.collection('user-data').insertOne(elemento, function (err, result) {
            assert.equal(null, err); //Verificamos que no haya erorres
            console.log('Elemento insertado');
            db.close();
        }); //Insertamos el nombre de la coleccion (equivalente a una tabla)
    });

    res.redirect("/"); //Redireccionamos a la pagina inicial
});

router.post('/update', function (req, res, next) {
    var elemento = {
        titulo : req.body.title,
        contenido : req.body.content,
        autor : req.body.author
    };

    var id = req.body.id;

    mongo.connect(url, function (err, db) {
        assert.equal(null, err); //Verificamos que no haya erorres

        db.collection('user-data').updateOne({"_id" : objectID(id)}, {$set: elemento}, function (err, result) {
            assert.equal(null, err); //Verificamos que no haya erorres
            console.log('Elemento actualizado');
            db.close();
        });
    });

    res.redirect("/"); //Redireccionamos a la pagina inicial
});

router.post('/delete', function (req, res, next) {
    var id = req.body.id;

    mongo.connect(url, function (err, db) {
        assert.equal(null, err); //Verificamos que no haya erorres

        db.collection('user-data').deleteOne({"_id" : objectID(id)}, function (err, result) {
            assert.equal(null, err); //Verificamos que no haya erorres
            console.log('Elemento eliminado');
            db.close();
        });
    });

    res.redirect("/"); //Redireccionamos a la pagina inicial
});

module.exports = router;