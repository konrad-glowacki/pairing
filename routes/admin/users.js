var express = require('express');
var router = express.Router();
var models = require('../../models');

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

module.exports = router;
