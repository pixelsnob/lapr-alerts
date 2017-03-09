
const 
  Promise  = require('bluebird'),
  csv      = Promise.promisifyAll(require('csv')),
  fs       = Promise.promisifyAll(require('fs')),
  parser_opts = {
    trim: true,
    skip_empty_lines: true,
    skip_lines_with_empty_values: true
  };

module.exports.saveAsJSON = () => {
  
  return fs.readFileAsync('./uploads/alerts', 'utf8')
    .then(data => csv.parseAsync(data, parser_opts))
    .then(data => data.map(cols => cols.map(col => col.trim())))
    // Quote first col
    .then(data => data.map(cols => {
      cols[0] = `"${cols[0]}"`;
      return cols.filter(col => col.length);
    }))
    .then(data => {
      const lines = data.map(cols => cols.join(' '));
      return Array.from(new Set(lines));
    })
    .then(data => {
      fs.writeFileAsync('uploads/alerts.json', JSON.stringify(data));
      return data;
    });

};


