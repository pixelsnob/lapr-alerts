
const casper = require('casper').create(),
      fs     = require('fs'),
      config = require('./config.json');

const url = 'https://accounts.google.com/ServiceLogin?hl=en&service=alerts' +
            '&continue=http://www.google.com/alerts/manage'; 

const selectors = {
  login_form:   'form#gaia_loginform',
  input:        '.query_div input[type=text]',
  submit:       '#create_alert',
  results:      '.page-content .my_alerts'
};

var stream  = fs.open('./data/alerts.csv', 'r'),
    line,
    alerts  = [],
    i       = 0;

while (line = stream.readLine()) {
  alerts[i] = line;
  i++;
}

casper.start(url, function() {
  this.waitForSelector(selectors.login_form);
}).then(function() {
  // Login
  this.echo('Logging in to ' + this.getTitle());
  this.fill(selectors.login_form, { Email: config.email });
  this.click('#next'); 
  //this.wait(500);
  this.waitForSelector("#Passwd");
}).then(function() {
  // Password
  this.fill(selectors.login_form, { Passwd: config.password });
  this.click("#signIn"); 
  this.waitForSelector(selectors.input);
}).then(function() {
  this.echo('Signed in as ' + config.email);
}).then(function() {
  // Add alerts 
  var i = 0;
  this.echo('Attempting to add ' + alerts.length + ' alerts');
  this.each(alerts, function(self, line) {
    line = line.replace(/^\s/, '');
    // Some time between requests to keep us from being banned
    this.wait(6000, function() {
      this.echo(line);
      this.sendKeys(selectors.input, line, { keepFocus: true });
      this.waitForSelector(selectors.submit, function() {
        this.click(selectors.submit);
        this.echo(i + '. ' + line);
      });
    });
  });
}).then(function() {
  this.echo('Done!');
});

casper.run();


