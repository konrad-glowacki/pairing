var nodemailer = require('nodemailer'),
    jade = require('jade'),
    config = require('../config/mailer');

Mailer = (function() {
  Mailer.prototype.options = {};

  Mailer.prototype.data = {};

  function Mailer(options, data) {
    this.options = options;
    this.data = data;
  }

  Mailer.prototype.send = function (callback) {
    var html, messageData, transport;
    html = this.getHtml(this.options.template, this.data);
    transport = this.getTransport();

    messageData = {
      to: this.options.recipients,
      from: config.message.from,
      subject: this.options.subject,
      html: html
    };

    return transport.sendMail(messageData, callback);
  };

  Mailer.prototype.getTransport = function () {
    return nodemailer.createTransport(config.server.url);
  };

  Mailer.prototype.templatePath = function (templateName) {
    return '/home/chwsm/apps/pairing/views/emails/' + templateName + '.jade';
  };

  Mailer.prototype.getHtml = function(templateName, data) {
    return jade.renderFile(this.templatePath(templateName), data);
  };

  return Mailer;
})();

module.exports = Mailer;
