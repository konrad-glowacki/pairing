var CronJob = require('cron').CronJob,
    Pairing = require('./pairing');

var scheduler = new CronJob({
  cronTime: '*/10 * * * * *',
  onTick: function() {
    var chwsm = new Pairing('chwsm');
    chwsm.sendNotifications();
  },
  start: true,
  timeZone: "Europe/Warsaw"
});

module.exports = scheduler;
