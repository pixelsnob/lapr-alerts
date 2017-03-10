
const csv = require('./lib/csv');

csv.saveAsJSON()
  .then(() => console.log('CSV files created'))
  .catch(console.err);

