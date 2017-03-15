
module.exports = function deleteAlertsRecursive() {
  this.waitForSelector(selectors.alert_delete, function() {
    this.click(selectors.alert_delete);
    this.waitForSelectorTextChange('.num_alerts', function() {
      this.echo("Deleting...\r");
      this.reload(deleteAlertsRecursive.bind(this));
    });
  }, function() {
    this.echo('All alerts deleted');
  });
};

