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

// router.get('/test/:id', function (req, res, next) {
//   res.render('test', {output: req.params.id});
// });
//
// router.post('/test/submit', function (req, res, next) {
//   //Obtenemos los valores del post
//     var id = req.body.id;
//     res.redirect('/test/' + id);
// });

// router.get('/user', function(req, res, next) {
//     res.send('respond with a resource');
// });
//
// router.get('/user/detail', function(req, res, next) {
//     res.send('User details');
// });

module.exports = router;