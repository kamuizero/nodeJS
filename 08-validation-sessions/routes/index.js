var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Form Validation', success: false, errors: req.session.errors});
  req.session.errors = null;
});


router.post('/submit', function(req, res, next) {
    //Chequear la validez
    req.check('email');
});

module.exports = router;
