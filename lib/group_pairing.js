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

  while (this.userIds.length > 1) {
    // console.log('FIRST LOOP START');
    // Take first ID
    var current = this.userIds.shift();
    // console.log('remove current: ' + current);

    do {
      if (loopInc > 1000) {
        // console.log("ERROR: NOT FOUND UNIQ PAIR!");
        return false;
      }

      // console.log('SECOND LOOP START');
      // Take random ID
      var random = _.sample(this.userIds);
      // console.log('random: ' + random);

      // Create example pair
      var pair = [current, random];
      var allPairs = history.concat(newPairs);

      // console.log(allPairs);
      var pairExist = _.some(allPairs, function(item) {
        return _.isEqual(_.sortBy(item), _.sortBy(pair));
      });

      // console.log('pair exist: ' + pairExist);
      // console.log('SECOND LOOP END');
      loopInc++;
      // console.log('loop number: ' + loopInc);
    } while (pairExist)

    // Remove random id from array
    this.userIds.splice(this.userIds.indexOf(random), 1);
    // console.log('remove random from array');

    // Insert pair if not exist
    newPairs.push(pair);
    // console.log('add pair to results: ' + pair);
    // console.log('FIRST LOOP END');
  }

  // Save new pairs
  _.forEach(newPairs, function(pair) {
    // console.log(pair);
    models.UserPairs.create({ RoundId: self.round.id, UserId: pair[0], PairId: pair[1] });
  });
}

GroupPairing.prototype.createPairs = function() {
  var self = this;

  pairs = _.groupBy(_.shuffle(self.userIds), function(element, index) {
    return Math.floor(index / 2);
  });

  _.forEach(pairs, function(pair) {
    models.UserPairs.create({ RoundId: self.round.id, UserId: pair[0], PairId: pair[1] });
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

  models.Group.find({
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

      models.UserPairs.findAll({ attributes: ['UserId', 'PairId'] }).then(function(userPairs) {
        if (userPairs.length > 0) {
          self.createPairsIncludingHistory(userPairs);
        } else {
          self.createPairs();
        }

        self.sendNotificationsForRound(round);
      });
    });
  });
}

module.exports = GroupPairing;
