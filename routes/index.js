var express = require('express'),
    form = require('express-form'),
    models = require('../models');

var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index');
});

router.get('/:slug', function(req, res, next) {
  models.Group.find({ where: { slug: req.params.slug } })
    .complete(function(error, group) {
      if (group) {
        res.render('group', { group: group });
      } else {
        res.render('error', { message: 'Page not exist', error: error });
      }
    });
});

router.post('/',
  form(
    form.field('groupId').required(),
    form.field('name').trim().required(),
    form.field('surname').trim().required(),
    form.field('email').trim().toLower().required().isEmail().custom(function(value, source) {
      models.User.count({ where: { email: source.email, GroupId: source.groupId } }).then(function(count) {
        if (count > 0) {
          throw new Error('This email is already exist');
        }
      });
    })
  ),
  function(req, res) {
    if (req.form.isValid) {
      models.User.create({
        GroupId: req.form.groupId,
        name: req.form.name,
        surname: req.form.surname,
        email: req.form.email
      }).then(function(user) {
        res.render('thanks', { email: user.email });
      });
    } else {
      models.Group.find({ slug: { slug: req.form.groupId } })
        .complete(function(error, group) {
          if (group) {
            res.render('group', {
              group: group,
              groupId: group.id,
              name: req.form.name,
              surname: req.form.surname,
              email: req.form.email,
              errors: req.form.errors
            });
          } else {
            res.render('error', { message: 'Page not exist', error: error });
          }
        });
    }
  }
);

module.exports = router;
