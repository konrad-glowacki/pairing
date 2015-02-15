var basicAuth = require('basic-auth'),
    config = require('../config/authentication');

var authenticate = function (req, res, next) {
  function unauthorized(res) {
    res.set('WWW-Authenticate', 'Basic realm=Authorization Required');
    return res.sendStatus(401);
  };

  var user = basicAuth(req);

  if (!user || !user.name || !user.pass) {
    return unauthorized(res);
  };

  if (user.name === config.user && user.pass === config.password) {
    return next();
  } else {
    return unauthorized(res);
  };
};

module.exports = authenticate;
