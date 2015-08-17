var express = require('express');
    path = require('path'),
    favicon = require('serve-favicon'),
    logger = require('morgan'),
    cookieParser = require('cookie-parser'),
    bodyParser = require('body-parser'),
    passport = require('passport'),
    session = require('express-session'),
    flash = require('connect-flash');

var routes = require('./routes/index'),
    groups = require('./routes/groups'),
    admin = require('./routes/admin/index'),
    adminGroups = require('./routes/admin/groups'),
    adminUsers = require('./routes/admin/users'),
    scheduler = require('./lib/scheduler'),
    auth = require('./lib/authentication'),
    models = require('./models');

var app = express();

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  models.Admin.findById(id).then(function(user) {
    done(null, user);
  });
});

passport.use(auth.localStrategy);

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(session({
  secret: '38@gyzx%k5_=g_vvo+!lic+3c1f4xuge&lxerrd&__dt21pybs',
  resave: false,
  saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

app.use(express.static(path.join(__dirname, 'public')));
app.use(require('less-middleware')(path.join(__dirname, 'public')));
app.use('/bower_components',  express.static(__dirname + '/bower_components'));

app.use('/', routes);
app.use('/groups', groups);
app.use('/admin', admin);
app.use('/admin/groups', auth.authenticate, adminGroups);
app.use('/admin/users', auth.authenticate, adminUsers);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// development error handler
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
      message: err.message,
      error: {}
  });
});

module.exports = app;
