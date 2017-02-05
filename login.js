
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

function getLine(stream) {
  return stream.readLine();
}

var stream         = fs.open('./data/alerts.csv', 'r'),
    line           = getLine(stream),
    search_queries = [],
    i              = 0;

while (line) {
  line = getLine(stream);
  search_queries[i] = line;
  i++;
}

casper.start(url, function() {
  this.waitForSelector(queries.login_form);
}).then(function() {
  this.echo('Logging in to ' + this.getTitle());
  this.fill(queries.login_form, { Email: config.email });
  this.click('#next'); 
  this.wait(500);
}).then(function() {
  this.waitForSelector("#Passwd");
}).then(function() {
  this.fill(queries.login_form, { Passwd: config.password });
  this.click("#signIn"); 
  this.capture('captures/capture-1.png');
  this.waitForSelector(queries.input);
}).then(function() {
  this.echo('Signed in as ' + config.email);
  this.each(search_queries, function(self, line) {
    line = line.replace(/^\s/, '');
    this.wait(5000, function() {
      self.echo(line);
      self.sendKeys(queries.input, line, { keepFocus: true });
      this.waitForSelector(queries.submit, function() {
        this.click(queries.submit);
        this.echo('Added alert: ' + line);
      });
    });
  });
}).then(function() {
  //this.capture('captures/capture-4.png');
  this.echo('Done!');
});

casper.run();


