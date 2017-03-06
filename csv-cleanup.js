/**
 * Reads uploaded csv file and removes whitespace, etc.
 * 
 */
const
  Promise   = require('bluebird'),
  fs        = Promise.promisifyAll(require('fs')),
  csv       = Promise.promisifyAll(require('csv')),
  filename  = 'alerts-clean.csv';

fs.readFileAsync('./uploads/alerts', 'utf8')
  .then(data   => csv.parseAsync(data, { trim: true }))
  .then(csv.stringifyAsync)
  .then(data   => fs.writeFileAsync(`./uploads/${filename}`, data))
  .then(console.log(`CSV cleaned and saved as ${filename}`))
  .then(console.log)
  .error(console.err);

