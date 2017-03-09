
const csv = require('./lib/csv');

csv.saveAsJSON().done(() => console.log('OK'), console.err);

