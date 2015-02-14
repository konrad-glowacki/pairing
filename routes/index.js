var express = require('express'),
    form = require('express-form');

var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index');
});

router.post('/',
  form(
    form.field('name').trim().required(),
    form.field('surname').trim().required(),
    form.field('email').trim().toLower().required().isEmail()
  ),
  function(req, res) {
    if (req.form.isValid) {
      res.render('thanks', { email: req.form.email });
    } else {
      res.render('index', {
        name: req.form.name,
        surname: req.form.surname,
        email: req.form.email,
        errors: req.form.errors
      });
    }
  }
);

module.exports = router;
