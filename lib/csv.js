
const 
  Promise  = require('bluebird'),
  csv      = Promise.promisifyAll(require('csv')),
  fs       = Promise.promisifyAll(require('fs')),
  
  parser_opts = {
    from: 2,
    trim: true,
    skip_empty_lines: true,
    skip_lines_with_empty_values: true
  };

module.exports.saveAsJSON = () => {
  
  return fs.readFileAsync('./uploads/alerts', 'utf8')
    .then(data => csv.parseAsync(data, parser_opts))
    .then(data => data.map(cols => cols.map(col => col.trim())))
    // Replace multiple spaces with one
    .then(data => data.map(cols => cols.map(col => col.replace(/\s{2,}/g, ' '))))
    .then(data => {
      // For informational purposes; not really necessary, since google
      // api is idempotent
      const temp_rows = [], duplicates = [];
      const unique = data.filter(row => {
        let line = row.join(' '),
          exists = (temp_rows.indexOf(line) > -1);
        if (exists) {
          duplicates.push(line);
        } else {
          temp_rows.push(line);
        }
        return !exists;
      });
      // First search term in double quotes
      const unique_quoted = unique.map(cols => {
        let temp_cols = cols.slice();
        temp_cols[0] = `"${temp_cols[0]}"`;
        return temp_cols;
      });
      const writeCleanCSV = data =>
        fs.writeFileAsync('uploads/alerts-clean.csv', data);
      return Promise.all([
        csv.stringifyAsync(unique).then(writeCleanCSV),
        fs.writeFileAsync('uploads/alerts.json', JSON.stringify(unique_quoted)),
        fs.writeFileAsync('uploads/duplicates.json', JSON.stringify(duplicates))
      ]);
    });

};


