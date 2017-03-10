
const 
  Promise  = require('bluebird'),
  csv      = Promise.promisifyAll(require('csv')),
  fs       = Promise.promisifyAll(require('fs')),
  
  parser_opts = {
    from: 2,
    trim: true,
    skip_empty_lines: true,
    skip_lines_with_empty_values: true
  },
  input_filename = 'uploads/alerts',
  clean_csv_filename = 'uploads/alerts-clean.csv',
  alerts_filename = 'uploads/alerts.json',
  duplicates_filename = 'uploads/duplicates.json';

module.exports.saveAsJSON = () => {
  
  let unique = [], duplicates = [];

  return fs.readFileAsync(input_filename, 'utf8')
    .then(data => csv.parseAsync(data, parser_opts))
    .then(data => {
      // Trim, replace multiple spaces with single space
      let temp_rows  = [];
      unique = data
        .map(cols => cols.map(col => col.trim()))
        .map(cols => cols.map(col => col.replace(/\s{2,}/g, ' ')))
        .filter(row => {
          let line = row.join(' ').trim(),
            exists = (temp_rows.indexOf(line) > -1);
          if (exists) {
            duplicates.push(line);
          } else {
            temp_rows.push(line);
          }
          return !exists;
        })
        // First search term should be quoted if it isn't already
        .map(cols => {
          let temp_cols = cols.slice();
          if (!/^\".*\"$/.test(temp_cols[0])) {
            temp_cols[0] = `"${temp_cols[0]}"`; 
          }
          return temp_cols;
        });
    })
    .then(() => csv.stringifyAsync(unique).then(data =>
      fs.writeFileAsync(clean_csv_filename, data)))
    .then(() => fs.writeFileAsync(alerts_filename, JSON.stringify(unique)))
    .then(() => fs.writeFileAsync(duplicates_filename, JSON.stringify(duplicates)));

};


