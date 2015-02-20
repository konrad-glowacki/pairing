var models = require('../models');
var _ = require('lodash-node');
var Mailer = require('./mailer')

function GroupPairing(groupSlug) {
  this.groupSlug = groupSlug;
}

GroupPairing.prototype.sendNotifications = function() {
  models.Group.find({
    where: { slug: this.groupSlug },
    include: [models.User]
  }).then(function(group) {
    var pairs = _.groupBy(_.shuffle(group.Users), function(element, index) {
      return Math.floor(index / 2);
    });

    _.forEach(pairs, function(pair) {
      var emails = _.map(pair, function(user) { return user.email }),
          subject = group.name + ': Przydzielenie osoby do modlitwy';

      var mailer = new Mailer({
          template: 'week_notification',
          recipients: emails,
          subject: subject
        }, { users: pair, group: group });

      mailer.send(function(err, result) {
        if (err) { return console.log(err); }
      });
    });
  });
}

module.exports = GroupPairing;
