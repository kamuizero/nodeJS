var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Form Validation', success: req.session.success, errors: req.session.errors});
  req.session.errors = null;
  req.session.success = null;

});

router.post('/submit', function(req, res, next) {
    //Chequear la validez
    req.check('email', 'Direccion de correo invalida').isEmail(); //Este nombre tiene que ser el mismo que el NOMBRE del elemento que queremos validar
    req.check('password', 'Password es invalido').isLength({min: 4}).equals(req.body.confirmPassword);

    var errors = req.validationErrors();

    if (errors) {
        req.session.errors = errors;
        req.session.success = false;
    } else {
        req.session.success = true;
    }
    res.redirect('/');
});

module.exports = router;