var express = require('express');
var router = express.Router();
var models = require('../models');

/* GET users listing. */
router.get('/', function(req, res, next) {
  models.User.findAll({ include: [models.Group] }).then(function(users) {
    res.render('users/index', { users: users });
  });
});

module.exports = router;
