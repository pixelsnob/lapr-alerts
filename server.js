
const path = require('path'),
  multer = require('multer'),
  multer_storage = multer.diskStorage({
    destination : path.resolve('uploads'),
    filename: (req, file, cb) => {
      cb(null, 'alerts');
    }
  }),
  express  = require('express'),
  Promise  = require('bluebird'),
  app      = express(),
  server   = require('http').Server(app),
  pug      = require('pug'),
  logger   = require('morgan'),
  cparser  = require('cookie-parser')
  bparser  = require('body-parser')
  upload   = multer({ storage: multer_storage }),
  port     = 3007,
  spawn    = require('child_process').spawn,
  io       = require('socket.io')(server),
  csv      = require('./lib/csv');

io.setMaxListeners(0);

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(bparser.json());
app.use(bparser.urlencoded({ extended: false }));
app.use(cparser());
app.use(express.static(path.join(__dirname, 'public')));

app.route('/').get((req, res, next) => {
  res.render('index', { title: 'Upload your file' });
}).post(upload.single('alerts'), (req, res, next) => {
  csv.saveAsJSON().then(() => res.render('index', { title: 'File uploaded' }))
    .error(next);
});

let processes = [],
  curr_proc;

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

