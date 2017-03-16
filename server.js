
const path = require('path'),
  config   = require('./config'),
  multer   = require('multer'),
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
  //logger   = require('morgan'),
  bparser  = require('body-parser')
  upload   = multer({ storage: multer_storage }),
  port     = 3007,
  spawn    = require('child_process').spawn,
  fs       = Promise.promisifyAll(require('fs')),
  csv      = require('./lib/csv'),
  jwt      = require('jsonwebtoken');

const socketio_jwt = require('socketio-jwt')

const io = require('socket.io')(server);
io.setMaxListeners(0);

io.use(socketio_jwt.authorize({
  secret: config.secret,
  handshake: true
}));

io.on('error', console.error);
io.on('disconnect', console.error);

require('./socketio-server')(io);

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

//app.use(logger('dev'));
app.use(bparser.json());
app.use(bparser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'client')));

app.route('/').get((req, res, next) => {
  res.render('index');
});

app.route('/login').get((req, res, next) => {
  if (req.query.username == config.email &&
      req.query.password == config.password) {
    let token = jwt.sign({ user: 1 }, config.secret);
    return res.json({ token });
  }
  res.json({ token: '' });
});

app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

app.use(function(err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.status(err.status || 500);
  res.format({
    html: () => res.render('error'),
    json: () => res.json({ ok: 0 })
  });
});

server.listen(port, () => console.log(`Listening on port ${port}`));

module.exports = app;

