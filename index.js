
const casper = require('casper').create(),
      fs     = require('fs'),
      system = require('system'),
      config = require('./config.json');

const url = 'https://accounts.google.com/ServiceLogin?hl=en&service=alerts' +
            '&continue=http://www.google.com/alerts/manage'; 

const selectors = {
  login_form:     'form#gaia_loginform',
  passwd:         '#Passwd',
  signin:         '#signIn',
  next:           '#next',
  input:          '.query_div input[type=text]',
  submit:         '#create_alert',
  results:        '.page-content .my_alerts',
  captcha:        '#captcha',
  captcha_submit: 'input[name="submit"]'
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
}).then(function login() {
  this.echo('Logging in to ' + this.getTitle());
  this.fill(selectors.login_form, { Email: config.email });
  this.click(selectors.next); 
  this.waitForSelector(selectors.passwd);
}).then(function password() {
  // Password
  this.fill(selectors.login_form, { Passwd: config.password });
  this.click(selectors.signin); 
  this.waitForSelector(selectors.input, null, function timeout() {
    // See if there's a captcha
    this.capture('captures/captcha.png');
    // Pause script until value is provided
    system.stdout.writeLine('Provide captcha value to continue: ');
    this.sendKeys(selectors.captcha, system.stdin.readLine());
    this.click(selectors.captcha_submit);
    this.waitForSelector(selectors.input);
  });
}).then(function addAlerts() {
  this.echo('Signed in as ' + config.email);
  // Add alerts 
  var i = 1;
  this.echo('Attempting to add ' + alerts.length + ' alerts');
  this.each(alerts, function(self, line) {
    // Remove leading space
    line = line.replace(/^\s/, '');
    // Some time between requests to keep us from being banned
    this.wait(500, function() {
      this.sendKeys(selectors.input, line, { keepFocus: true });
      this.waitForSelector(selectors.submit, function() {
        this.click(selectors.submit);
        this.echo(i + '. [Added] ' + line);
        i++;
      });
    });
  });
}).then(function() {
  this.echo('Done!');
});

casper.run();


