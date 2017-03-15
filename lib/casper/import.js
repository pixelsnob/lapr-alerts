
var   casper                = require('casper').create(),
      fs                    = require('fs')
      config                = require('../../config.json')
      shuffle               = require('../shuffle');
      selectors             = require('./selectors');
      login                 = require('./login');


var alerts_json = fs.read('uploads/alerts.json'),
    alerts      = JSON.parse(alerts_json);

alerts = shuffle(alerts);

login.apply(casper)
  .then(function addAlerts() {
    var i = 1;
    this.echo('Attempting to add ' + alerts.length + ' alerts');
    this.each(alerts, function(self, line) {
      var line = line.join(' ');
      this.wait(config.wait_between_adds).then(function() {
        this.sendKeys(selectors.input, line, { keepFocus: true })
      }).then(function() {
        this.waitForSelector(selectors.submit);
      }).then(function() {
        this.click(selectors.submit);
        this.capture('captures/add-' + i + '.png');
        this.echo(i + '. [Added] ' + line);
        i++;
      });
    });
  })
  .then(function done() {
    this.echo('Done!');
  });

casper.run();


