var models = require('../models');
var _ = require('lodash-node');
var Mailer = require('./mailer');

function GroupPairing(groupSlug) {
  this.groupSlug = groupSlug;
  this.loopInc = 0;
}

GroupPairing.prototype.searchPairs = function(users) {
  var self = this;
  var currentUser = users[0];
  var randomUser;

  if (self.loopInc > 1000) {
    console.log("ERROR!");
    return false;
  }

  while (users.length > 1) {
    console.log('LOOP START');
    console.log('currentUser: ' + currentUser.id);

    // Remove current user from array
    _.remove(users, function(user) { user.id == currentUser.id });

    // Get random user
    randomUser = _.sample(users);
    console.log('randomUser: ' + randomUser.id);

    // Pair have been already together
    models.UserPairs.find({
      $or: [
        { UserId: currentUser.id, PairId: randomUser.id },
        { UserId: randomUser.id, PairId: currentUser.id }
      ]
    }).then(function(pair) {
      if (pair) {
        console.log('pair exist & search again: ' + self.loopInc);

        self.loopInc++;
        self.searchPairs(users)
      } else {
        // Remove random user from array
        _.remove(users, function(user) { user.id == randomUser.id });
        currentUser.addPair(randomUser, { RoundId: self.round.id })

        console.log('create pair');
      }
    });

    console.log('LOOP END');
  }
}

GroupPairing.prototype.sendNotifications = function() {
  var self = this;

  models.Group.find({
    where: { slug: self.groupSlug },
    include: [models.User, models.Round]

  }).then(function(group) {
    self.group = group;

    models.Round.create({
      number: group.Rounds.length + 1,
      GroupId: group.id

    }).then(function(round) {
      self.round = round;
      self.searchPairs(group.Users);
    });

    // var pairs = _.groupBy(_.shuffle(group.Users), function(element, index) {
    //   return Math.floor(index / 2);
    // });
    //
    // _.forEach(pairs, function(pair) {
    //   var emails = _.map(pair, function(user) { return user.email }),
    //       subject = group.name + ': Przydzielenie osoby do modlitwy';
    //
    //   var mailer = new Mailer({
    //       template: 'week_notification',
    //       recipients: emails,
    //       subject: subject
    //     }, { users: pair, group: group });
    //
    //   mailer.send(function(err, result) {
    //     if (err) { return console.log(err); }
    //   });
    // });
  });
}

module.exports = GroupPairing;
