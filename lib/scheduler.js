var CronJob = require('cron').CronJob,
    GroupPairing = require('./group_pairing');

var chwsmScheduler = new CronJob({
  // at 8:30 in 10 and 24 day in month
  cronTime: '0 30 8 10,24 * *',
  onTick: function() {
    new GroupPairing('chwsm').createPairsAndSendNotifications();
  },
  start: true,
  timeZone: "Europe/Warsaw"
});

var sngScheduler = new CronJob({
  cronTime: '0 50 23 * * 1',
  onTick: function() {
    new GroupPairing('sng').createPairsAndSendNotifications();
  },
  start: true,
  timeZone: "Europe/Warsaw"
});

// var scholaScheduler = new CronJob({
//   cronTime: '0 37 21 * * 0',
//   onTick: function() {
//     new GroupPairing('schola').createPairsAndSendNotifications();
//   },
//   start: true,
//   timeZone: "Europe/Warsaw"
// });

module.exports = [sngScheduler];
