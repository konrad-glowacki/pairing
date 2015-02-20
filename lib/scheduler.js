var CronJob = require('cron').CronJob,
    Pairing = require('./group_pairing');

var scheduler = new CronJob({
  cronTime: '0 55 23 * * 2',
  onTick: function() {
    var chwsm = new GroupPairing('chwsm');
    chwsm.sendNotifications();
  },
  start: true,
  timeZone: "Europe/Warsaw"
});

module.exports = scheduler;
