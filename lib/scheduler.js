var CronJob = require('cron').CronJob,
    GroupPairing = require('./group_pairing');

var chwsmScheduler = new CronJob({
  cronTime: '0 30 7 15,30 * *',
  onTick: function() {
    new GroupPairing('chwsm').createPairsAndSendNotifications();
  },
  start: true,
  timeZone: "Europe/Warsaw"
});

var sngScheduler = new CronJob({
  cronTime: '0 45 23 * * 1',
  onTick: function() {
    new GroupPairing('sng').createPairsAndSendNotifications();
  },
  start: true,
  timeZone: "Europe/Warsaw"
});

var scholaScheduler = new CronJob({
  cronTime: '0 0 22 * * 6',
  onTick: function() {
    new GroupPairing('schola').createPairsAndSendNotifications();
  },
  start: true,
  timeZone: "Europe/Warsaw"
});

module.exports = [sngScheduler];
