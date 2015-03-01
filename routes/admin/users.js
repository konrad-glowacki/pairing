var express = require('express'),
    router = express.Router(),
    dateFormat = require('dateformat'),
    models = require('../../models');

router.get('/history/:id', function(req, res, next) {
  models.User.find({ where: { id: req.params.id }, include: [models.Group]}).then(function(user) {
    if (user) {
      models.UserPairs.findAll({
        where: { $or: [{ UserId: user.id }, { PairId: user.id }] },
        include: [models.User, models.Round, models.UserPairs.belongsTo(models.User, { as: 'Pair', foreignKey: 'PairId' })]
      }).then(function(userPairs) {
        res.render('admin/users/history', { user: user, userPairs: userPairs, dateFormat: dateFormat });
      });
    } else {
      res.render('error', { message: 'User not exist!' });
    }
  });
});

router.delete('/destroy/:id', function(req, res, next) {
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
