
module.exports = function deleteAlertsRecursive() {
  this.waitForSelector(selectors.alert_delete, function() {
    this.click(selectors.alert_delete);
    this.waitForSelectorTextChange('.num_alerts', function() {
      this.reload(deleteAlertsRecursive.bind(this));
    });
  }, function() {
    this.echo('All alerts deleted');
  });
}

