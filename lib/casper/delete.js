
const casper                  = require('casper').create(),
      config                  = require('../../config.json'),
      selectors               = require('./selectors'),
      deleteAlertsRecursive   = require('./delete-recursive'),
      login                   = require('./login');


login.apply(casper)
  .then(function() {
    this.echo('Preparing to delete all alerts!');
  })
  .then(deleteAlertsRecursive.bind(casper))
  .then(function done() {
    this.echo('Done!');
  });

casper.run();


