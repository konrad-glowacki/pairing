var express = require('express'),
    router = express.Router(),
    dateFormat = require('dateformat');
    models = require('../../models');

router.get('/', function(req, res, next) {
  models.Group.findAll({ include: [models.User] }).then(function(groups) {
    res.render('admin/index', { groups: groups, dateFormat: dateFormat });
  });
});

module.exports = router;
