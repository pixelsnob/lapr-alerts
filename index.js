
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
  captcha_submit: 'input[name="submit"]',
  alert_delete:   '#manage-alerts-div ul li.alert_instance:first-child .delete_button'
};

var stream  = fs.open('./data/alerts.csv', 'r'),
    line,
    alerts  = [],
    i       = 0;

while (line = stream.readLine()) {
  alerts[i] = line;
  i++;
}

function deleteAlertsRecursive() {
  this.waitForSelector(selectors.alert_delete, function() {
    this.click(selectors.alert_delete);
    this.wait(1000, function() {
      this.reload(deleteAlertsRecursive.bind(this));
    });
  }, function() {
    this.echo('All alerts deleted');
  });
}

casper.start(url, function() {
  this.waitForSelector(selectors.login_form);

}).then(function login() {
  this.echo('Logging in to ' + this.getTitle());
  this.fill(selectors.login_form, { Email: config.email });
  this.click(selectors.next); 
  this.waitForSelector(selectors.passwd);

}).then(function password() {
  this.fill(selectors.login_form, { Passwd: config.password });
  this.click(selectors.signin); 
  this.waitForSelector(selectors.input, null, function checkForCaptcha() {
    this.capture('captures/captcha.png');
    // Pause script until value is provided
    system.stdout.writeLine('Provide captcha value to continue: ');
    this.sendKeys(selectors.captcha, system.stdin.readLine());
    this.click(selectors.captcha_submit);
  });

}).then(function signedIn() {
  this.echo('Signed in as ' + config.email);

}).then(function removeAllAlerts() {
  deleteAlertsRecursive.call(this);
}).then(function addAlerts() {
  var i = 1;
  this.echo('Attempting to add ' + alerts.length + ' alerts');
  this.each(alerts, function(self, line) {
    line = line.replace(/^\s/, '');
    // Some time between requests to keep us from being banned
    this.wait(200, function addAlert() {
      this.sendKeys(selectors.input, line, { keepFocus: true });
      this.waitForSelector(selectors.submit, function() {
        this.click(selectors.submit);
        this.echo(i + '. [Added] ' + line);
        i++;
      });
    });
  });

}).then(function done() {
  this.echo('Done!');
});

casper.run();


