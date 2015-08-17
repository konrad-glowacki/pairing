var _ = require('lodash-node');
var models = require('../models');
var Mailer = require('./mailer');

function GroupPairing(groupSlug) {
  this.groupSlug = groupSlug;
}

GroupPairing.prototype.createPairsIncludingHistory = function(userPairs) {
  var self = this, loopInc = 0;
  var pairs = [], newPairs = [];

  var history = _.map(userPairs, function(item) {
    return [item.UserId, item.PairId];
  });

  while (self.userIds.length > 0) {
    // Take first ID
    var current = self.userIds.shift();

    // When one user left alone send single notification
    if (self.userIds.length === 0) {
      self.sendNotificationsForSingleUserId(current);
    }

    loopInc = 0;

    do {
      if (loopInc > 100000) {
        console.log('ERROR: To much loop searching!');
        return false;
      }

      // Take random ID
      var random = _.sample(this.userIds);

      // Create example pair
      var pair = [current, random];
      var allPairs = history.concat(newPairs);

      var pairExist = _.some(allPairs, function(item) {
        return _.isEqual(_.sortBy(item), _.sortBy(pair));
      });

      loopInc++;
    } while (pairExist)

    // Remove random id from array
    this.userIds.splice(self.userIds.indexOf(random), 1);

    // Insert pair if not exist
    newPairs.push(pair);
  }

  // Save new pairs
  _.forEach(newPairs, function(pair) {
    if (pair[0] && pair[1]) {
      promise = models.UserPairs.create({ RoundId: self.round.id, UserId: pair[0], PairId: pair[1] });
    }
  });

  if (promise) {
    promise.then(function() {
      self.sendNotificationsForRound(self.round);
    })
  }
}

GroupPairing.prototype.createPairsFirstTime = function() {
  var self = this;

  pairs = _.groupBy(_.shuffle(self.userIds), function(element, index) {
    return Math.floor(index / 2);
  });

  _.forEach(pairs, function(pair) {
    if (_.isUndefined(pair[1])) {
      self.sendNotificationsForSingleUserId(pair[0]);
    } else {
      promise = models.UserPairs.create({ RoundId: self.round.id, UserId: pair[0], PairId: pair[1] });
    }
  });

  if (promise) {
    promise.then(function() {
      self.sendNotificationsForRound(self.round);
    })
  }
}

GroupPairing.prototype.sendNotificationsForSingleUserId = function(userId) {
  var self = this;

  models.User.findById(userId).then(function(user) {
    var mailer = new Mailer({
        template: 'single_notification',
        recipients: user.email,
        subject: self.group.name + ': Przydzielenie osoby do modlitwy'
      }, { user: user, round: self.round, group: self.group });

    mailer.send(function(err, result) {
      if (err) { return console.log(err); }
    });
  });
}

GroupPairing.prototype.sendNotificationsForRound = function(round) {
  var self = this;

  models.UserPairs.findAll({
    where: { RoundId: round.id },
    include: [models.User, { model: models.User, as: 'Pair' }]
  }).then(function(pairs) {
    _.forEach(pairs, function(pair) {
      var mailer = new Mailer({
          template: 'pair_notification',
          recipients: [pair.User.email, pair.Pair.email],
          subject: self.group.name + ': Przydzielenie osoby do modlitwy'
        }, { user: pair.User, pair: pair.Pair, round: round, group: self.group });

      mailer.send(function(err, result) {
        if (err) { return console.log(err); }
      });
    });
  });
}

GroupPairing.prototype.createPairsAndSendNotifications = function() {
  var self = this;

  models.Group.findOne({
    where: { slug: self.groupSlug },
    include: [models.User, models.Round]
  }).then(function(group) {
    self.group = group;
    self.userIds = _.pluck(group.Users, 'id');

    models.Round.create({
      number: group.Rounds.length + 1,
      GroupId: group.id

    }).then(function(round) {
      self.round = round;

      models.UserPairs.findAll({ attributes: ['UserId', 'PairId'] })
        .then(function(userPairs) {
          if (userPairs.length > 0) {
            self.createPairsIncludingHistory(userPairs);
          } else {
            self.createPairsFirstTime();
          }
        });
    });
  });
}

module.exports = GroupPairing;
