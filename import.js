
const casper                = require('casper').create(),
      fs                    = require('fs'),
      config                = require('./config.json'),
      selectors             = require('./lib/selectors'),
      stream                = fs.open('./data/alerts.csv', 'r'),
      deleteAlertsRecursive = require('./lib/delete'),
      _                     = require('underscore')
      login                 = require('./lib/login');

var line,
    alerts  = [],
    i       = 0;

while (line = stream.readLine()) {
  alerts[i] = line;
  i++;
}

alerts = _.uniq(alerts);

login.apply(casper)
  .then(function addAlerts() {
    var i = 1;
    this.echo('Attempting to add ' + alerts.length + ' alerts');
    this.each(alerts, function(self, line) {
      line = line.replace(/^\s/, '');
      this.wait(1200).then(function() {
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


