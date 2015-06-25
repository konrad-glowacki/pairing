var CronJob = require('cron').CronJob,
    GroupPairing = require('./group_pairing');

// var chwsmScheduler = new CronJob({
//   cronTime: '0 55 23 * * 2',
//   onTick: function() {
//     new GroupPairing('chwsm').createPairsAndSendNotifications();
//   },
//   start: true,
//   timeZone: "Europe/Warsaw"
// });

var sngScheduler = new CronJob({
  cronTime: '0 0 23 * * 4',
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
