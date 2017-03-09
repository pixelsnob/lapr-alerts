
var   casper                = require('casper').create(),
      fs                    = require('fs'),
      config                = require('./config.json'),
      selectors             = require('./lib/selectors'),
      deleteAlertsRecursive = require('./lib/delete'),
      login                 = require('./lib/login');

// Due to issues with importing other modules, any csv cleaning needs to be done
// in a separate script and saved to a JSON file
var alerts_json = fs.read('uploads/alerts.json'),
    alerts      = JSON.parse(alerts_json);

alerts.sort(function(a, b) {
  a = a.replace(/^"/, '');
  b = b.replace(/^"/, '');
  return a[0].localeCompare(b[0]);
});

login.apply(casper)
  .then(function addAlerts() {
    var i = 1;
    this.echo('Attempting to add ' + alerts.length + ' alerts');
    this.each(alerts, function(self, line) {
      //var line = line.join(' ');
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

