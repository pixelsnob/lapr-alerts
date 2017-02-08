
const url = 'https://accounts.google.com/ServiceLogin?hl=en&service=alerts' +
            '&continue=http://www.google.com/alerts/manage'; 

module.exports = function login() {
  this.start(url, function() {
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
  });
  return this;
};

