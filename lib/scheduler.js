var CronJob = require('cron').CronJob,
    Pairing = require('./pairing');

var scheduler = new CronJob({
  cronTime: '0 50 23 * * 2',
  onTick: function() {
    var chwsm = new Pairing('chwsm');
    chwsm.sendNotifications();
  },
  start: true,
  timeZone: "Europe/Warsaw"
});

module.exports = scheduler;
