
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
    .then(data => {
      data = data.map(cols => cols.map(col => col.trim()))
                 .map(cols => cols.map(col => col.replace(/\s{2,}/g, ' ')));
      // For informational purposes re: duplicates; not really necessary, since google
      // api is idempotent
      let temp_rows  = [],
          duplicates = [];
      data = data.filter(row => {
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
      const writeCleanCSV = csv_data =>
        fs.writeFileAsync('uploads/alerts-clean.csv', csv_data);
      return Promise.all([
        csv.stringifyAsync(data).then(writeCleanCSV),
        fs.writeFileAsync('uploads/alerts.json', JSON.stringify(data)),
        fs.writeFileAsync('uploads/duplicates.json', JSON.stringify(duplicates))
      ]);
    });

};


