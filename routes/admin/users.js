var express = require('express');
var router = express.Router();
var models = require('../../models');
var Mailer = require('../../lib/mailer')

router.get('/', function(req, res, next) {
  models.User.findAll({ include: [models.Group] }).then(function(users) {
    res.render('admin/users/index', { users: users });
  });
});

router.get('/:id/destroy', function(req, res, next) {
  models.User.find(req.params.id).then(function(user) {
    if (user) {
      user.destroy().then(function() {
        res.redirect('/admin/users');
      });
    } else {
      res.render('error', { message: 'User not exist!' });
    }
  });
});

router.get('/test', function(req, res, next) {
  var mailer = new Mailer({
      template: 'week_notification',
      recipients: 'admin@chrystuswmiescie.pl',
      subject: 'PrayPairing: Przydzielenie osoby do modlitwy'
    }, { users: [{ name: 'Konrad' }] });

  mailer.send(function(err, result) {
    if (err) { return console.log(err); }
  });

  res.end('Message Sent!');
});

module.exports = router;
