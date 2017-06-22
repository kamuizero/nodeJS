var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) { //Aqui la ruta es relativa, por eso es que se usa solamente el slash '/users/'
  res.send('respond with a resource');
});

router.get('/detail', function(req, res, next) {
    res.send('User details');
});

module.exports = router;
