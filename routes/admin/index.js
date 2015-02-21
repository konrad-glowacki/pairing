var express = require('express'),
    router = express.Router(),
    models = require('../../models'),
    passport = require('passport');

router.get('/', function(req, res, next) {
  res.redirect('/admin/groups');
});

router.get('/login', function(req, res, next) {
  res.render('admin/login', { user: req.user, message: req.flash('error') });
});

router.post('/login',
  passport.authenticate('local', {
    successRedirect: '/admin',
    failureRedirect: '/admin/login',
    failureFlash: true
  })
);

router.get('/logout', function(req, res, next) {
  req.logout();
  res.redirect('/admin');
});

module.exports = router;
