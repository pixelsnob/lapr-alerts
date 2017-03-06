
const path = require('path');
const multer = require('multer');

const multer_storage = multer.diskStorage({
  destination : path.resolve('uploads'),
  filename: (req, file, cb) => {
    cb(null, 'alerts');
  }
});

const express  = require('express'),
      app      = express(),
      server   = require('http').Server(app),
      pug      = require('pug'),
      logger   = require('morgan'),
      cparser  = require('cookie-parser')
      bparser  = require('body-parser')
      upload   = multer({ storage: multer_storage }),
      csv      = require('csv'),
      port     = 3007,
      io       = require('socket.io')(server);

io.setMaxListeners(0);


const spawn = require('child_process').spawn;
const fs = require('fs');

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(bparser.json());
app.use(bparser.urlencoded({ extended: false }));
app.use(cparser());
app.use(express.static(path.join(__dirname, 'public')));

app.route('/').get((req, res, next) => {
  res.render('index', { title: 'index' });
}).post(upload.single('alerts'), (req, res, next) => {
  // Read uploaded file
  fs.readFile('uploads/alerts', 'utf8', (err, data) => {
    if (err) {
      return next(err);
    }
    // Parse csv
    let csv_opts = { trim: true };
    csv.parse(data, csv_opts, (err, parsed) => {
      fs.writeFile('uploads/alerts.json', JSON.stringify(parsed), (err) => {
        if (err) {
          return next(err);
        }
        res.render('index', { title: 'index2' });
      });
    });
  });
  
});

let processes = [];

let curr_proc;

io.on('connection', (io) => {
  const cancelListener = function() {
    stopProcesses.call(this);
  };
  io.on('import', runProcess.bind(io, 'import'));
  io.on('delete-all', runProcess.bind(io, 'delete-all'));
  io.on('disconnect', () => {
    stopProcesses.call(io);
  });
  io.on('cancel', cancelListener);
});


function runProcess(action) {
  let proc = spawn('./node_modules/casperjs/bin/casperjs',
    [ '--verbose', '--log-level=error', './' + action + '.js' ]);
  processes.push(proc);
  proc.stderr.on('data', data => {
    this.emit('status', data.toString());
  });
  proc.stdout.on('data', data => {
    this.emit('status', data.toString());
  });
  proc.on('close', () => {
    stopProcesses.call(this);
  });
  
}

function stopProcesses() {
  if (processes.length == 0) {
    return;
  }
  processes.forEach((proc) => {
    proc.stdin.pause();
    proc.kill();
    this.emit('status', 'Process ' + proc.pid + ' stopped');
  });
  processes = [];
  
};

app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

app.use(function(err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.status(err.status || 500);
  res.render('error');
});

server.listen(port, () => console.log(`Listening on port ${port}`));

module.exports = app;

