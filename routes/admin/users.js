var express = require('express');
var router = express.Router();
var models = require('../../models');

router.get('/:id/destroy', function(req, res, next) {
  models.User.find(req.params.id).then(function(user) {
    if (user) {
      user.destroy().then(function() {
        res.redirect('/admin');
      });
    } else {
      res.render('error', { message: 'User not exist!' });
    }
  });
});

module.exports = router;
