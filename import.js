
const casper                = require('casper').create(),
      fs                    = require('fs'),
      config                = require('./config.json'),
      selectors             = require('./lib/selectors'),
      stream                = fs.open('./data/alerts.csv', 'r'),
      deleteAlertsRecursive = require('./lib/delete'),
      login                 = require('./lib/login');

var line,
    alerts  = [],
    i       = 0;

while (line = stream.readLine()) {
  alerts[i] = line;
  i++;
}

login.apply(casper)
  .then(deleteAlertsRecursive.bind(casper))
  .then(function addAlerts() {
    var i = 1;
    this.echo('Attempting to add ' + alerts.length + ' alerts');
    this.each(alerts, function(self, line) {
      line = line.replace(/^\s/, '');
      // Some time between requests to keep us from being banned
      this.wait(700, function addAlert() {
        this.sendKeys(selectors.input, line, { keepFocus: true });
        this.waitForSelector(selectors.submit, function() {
          this.click(selectors.submit);
          this.echo(i + '. [Added] ' + line);
          i++;
        });
      });
    });
  })
  .then(function done() {
    this.echo('Done!');
  });

casper.run();


