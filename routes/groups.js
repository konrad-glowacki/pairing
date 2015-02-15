var express = require('express'),
    models = require('../models'),
    router = express.Router();

router.get('/thanks/:id', function(req, res, next) {
  models.User.find({ where: { id: req.params.id }, include: [models.Group] }).then(function(user) {
    if (user) {
      res.render('groups/thanks', { user: user });
    } else {
      res.render('error', { message: 'Page not exist' });
    }
  })
});

router.get('/:slug', function(req, res, next) {
  models.Group.find({ where: { slug: req.params.slug } })
    .complete(function(error, group) {
      if (group) {
        res.render('groups/index', { group: group });
      } else {
        res.render('error', { message: 'Page not exist', error: error });
      }
    });
});

router.post('/', function(req, res) {
  models.User.create({
    GroupId: req.body.groupId,
    name: req.body.name,
    surname: req.body.surname,
    email: req.body.email
  })
  .success(function(user) {
    res.redirect('groups/thanks/' + user.id);
  })
  .error(function(response) {
    models.Group.find({ slug: { slug: req.body.groupId } })
      .then(function(group) {
        res.render('groups/index', {
          group: group,
          groupId: group.id,
          name: req.body.name,
          surname: req.body.surname,
          email: req.body.email,
          errors: response.errors
        });
      });
  });
});

module.exports = router;
