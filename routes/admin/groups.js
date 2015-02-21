var express = require('express'),
    router = express.Router(),
    dateFormat = require('dateformat'),
    models = require('../../models');

router.get('/', function(req, res, next) {
  models.Group.findAll({ include: [models.User], order: [[models.User, 'id']] }).then(function(groups) {
    res.render('admin/groups/index', { admin: req.user, groups: groups, dateFormat: dateFormat });
  });
});

router.get('/:id/destroy', function(req, res, next) {
  models.User.find(req.params.id).then(function(user) {
    if (user) {
      user.destroy().then(function() {
        res.redirect('/admin/groups');
      });
    } else {
      res.render('error', { message: 'User not exist!' });
    }
  });
});

module.exports = router;
