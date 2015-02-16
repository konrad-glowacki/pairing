var express = require('express'),
    router = express.Router(),
    Mailer = require('../lib/mailer');

router.get('/', function(req, res, next) {
  res.render('index');
});

module.exports = router;
