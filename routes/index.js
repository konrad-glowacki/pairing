var express = require('express'),
    router = express.Router(),
    Mailer = require('../lib/mailer');

router.get('/', function(req, res, next) {
  res.render('index');
});

router.get('/test', function(req, res, next) {
  var data = { name: 'Zenek' };

  var mailer = new Mailer({
    template: 'test',
    recipients: 'test@wp.pl',
    subject: 'Some subject'
  }, data);

  mailer.send(function(err, result) {
    if (err) {
      return console.log(err);
    }
  });

  res.render('index');
});

module.exports = router;
