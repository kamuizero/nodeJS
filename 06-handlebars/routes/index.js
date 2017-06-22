var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Nice test', condition: true, arreglo: [1,2,3]});
});

// router.get('/user', function(req, res, next) {
//     res.send('respond with a resource');
// });
//
// router.get('/user/detail', function(req, res, next) {
//     res.send('User details');
// });

module.exports = router;
