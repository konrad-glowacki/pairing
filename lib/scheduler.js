var CronJob = require('cron').CronJob,
    GroupPairing = require('./group_pairing');

var chwsmScheduler = new CronJob({
  cronTime: '0 55 23 * * 2',
  onTick: function() {
    new GroupPairing('chwsm').sendNotifications();
  },
  start: true,
  timeZone: "Europe/Warsaw"
});

var scholaScheduler = new CronJob({
  cronTime: '0 37 21 * * 0',
  onTick: function() {
    new GroupPairing('schola').sendNotifications();
  },
  start: true,
  timeZone: "Europe/Warsaw"
});

module.exports = [chwsmScheduler, scholaScheduler];
