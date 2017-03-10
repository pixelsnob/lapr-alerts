
const csv = require('./lib/csv');

csv.saveAsJSON()
  .then(({ unique, duplicates }) => {
    console.log('Unique records: %d', unique.length);
    console.log('Duplicate records: %d', duplicates.length);
  })
  .catch(console.dir);

