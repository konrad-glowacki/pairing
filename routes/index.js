var express = require('express'),
    models = require('../models'),
    router = express.Router();

router.get('/', function(req, res, next) {
  res.render('index');
});

module.exports = router;
