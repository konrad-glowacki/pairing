var models = require('../models'),
    flash = require('connect-flash'),
    LocalStrategy = require('passport-local').Strategy;

var authentication = {};

authentication.localStrategy = new LocalStrategy(
  {
    usernameField: 'email',
    passwordField: 'password'
  },

  function(email, password, done) {
    models.Admin.find({ where: { email: email } }).then(function(admin) {
      if(!admin){
        return done(null, false, { message: 'Incorrect admin data' });
      }

      if (password == admin.password) {
        return done(null, admin);
      }

      done(null, false, { message: 'Incorrect password' });
    });
  }
);

authentication.authenticate = function(req, res, next) {
  if (req.isAuthenticated()) { return next(); }
  res.redirect('/admin/login');
};

module.exports = authentication;
