
const casper = require('casper').create(),
      fs     = require('fs'),
      config = require('./config.json');

const url = 'https://accounts.google.com/ServiceLogin?hl=en&service=alerts' +
            '&continue=http://www.google.com/alerts/manage'; 

const queries = {
  login_form:   'form#gaia_loginform',
  input:        '.query_div input[type=text]',
  submit:       '#create_alert',
  results:      '.page-content .my_alerts'
};


casper.start(url, function() {
  this.waitForSelector(queries.login_form);
}).then(function() {
  this.echo(this.getTitle());
  this.capture('captures/capture-1.png');
  this.fill(queries.login_form, { Email: config.email });
  this.click('#next'); 
  this.wait(500);
}).then(function() {
  this.waitForSelector("#Passwd");
}).then(function() {
  this.fill(queries.login_form, { Passwd: config.password });
  this.capture('captures/capture-2.png');
  this.click("#signIn"); 
  this.wait(500);
}).then(function() {
  this.sendKeys(queries.input, 'Aaron Copland', { keepFocus: true });
  this.waitForSelector(queries.submit);
}).then(function() {
  this.click(queries.submit);
  this.waitForSelector(queries.input);
}).then(function() {
  this.sendKeys(queries.input, 'Nixon in China', { keepFocus: true });
  this.waitForSelector(queries.submit);
}).then(function() {
  this.capture('captures/capture-3.png');
  this.click(queries.submit);
  this.waitForSelector(queries.results);
}).then(function() {
  this.capture('captures/capture-4.png');
});

casper.run();


