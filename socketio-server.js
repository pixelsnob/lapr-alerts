
module.exports = io => {

  let proc;
  
  io.on('connection', (io) => {
    io.on('import', () => runProcess('import'));
    io.on('delete', () => runProcess('delete'));
    io.on('disconnect', stopProcess);
    io.on('cancel', stopProcess);
    io.on('upload', file => {
      fs.writeFileAsync('./uploads/alerts', file).then(() => {
        csv.saveAsJSON().then(() => io.emit('upload-success'))
          .catch(err => io.emit('upload-fail', err));
      });
    });
    io.on('captcha-answer', data => {
      if (proc) {
        proc.stdin.write(data + "\n");
      }
    });
  });
  
  function runProcess(action) {
    if (proc) {
      io.emit('status', 'Process already running');
      return;
    }
    proc = spawn('./node_modules/casperjs/bin/casperjs',
      [ '--verbose', '--log-level=error', './lib/casper/' + action + '.js' ]);
    proc.stderr.on('data', data => {
      io.emit('status', data.toString());
    });
    proc.stdout.on('data', data => {
      let status = data.toString();
      io.emit('status', status);
      if (status.indexOf('captcha') > -1) {
        fs.readFileAsync('./captures/captcha.png').then(data => {
          const prefix = 'data:image/png;base64,',
                str    = new Buffer(data, 'binary').toString('base64');
          io.emit('captcha', prefix + str);
        });
      }
    });
    proc.on('close', stopProcess);
  }
  
  function stopProcess() {
    if (proc) {
      proc.stdin.pause();
      proc.kill();
      io.emit('status', `Process ${proc.pid} stopped`);
      proc = null;
    }
  };
}


