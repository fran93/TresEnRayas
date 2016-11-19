const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');

//sesiones
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const session = require('express-session')
const FileStore = require('session-file-store')(session);
//sesiones
const sessionCookie = 'notes.sid';
const sessionSecret = 'keyboard mouse';
const sessionStore  = new FileStore({ path: "sessions" });
const flash = require('connect-flash');

//Socket IO
const http = require('http');
const passportSocketIo = require("passport.socketio");

//Routers
var users = require('./routes/users');
var index = require('./routes/index');
var bot = require('./routes/bot');

var app = express();

/**
 * Create HTTP server.
 */

var server = http.createServer(app);
var io = require('socket.io')(server);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(flash());

//Redirección stática para bootstrap
app.use('/vendor/bootstrap/css', express.static(path.join(__dirname, 'bower_components', 'bootstrap', 'dist', 'css')));
app.use('/vendor/bootstrap/fonts', express.static(path.join(__dirname, 'bower_components', 'bootstrap', 'dist', 'fonts')));
app.use('/vendor/bootstrap/js', express.static(path.join(__dirname, 'bower_components', 'bootstrap', 'dist', 'js')));
app.use('/vendor/jquery', express.static(path.join(__dirname, 'bower_components', 'jquery', 'dist')));

//Integrar las sesiones con express
app.use(session({
  store: sessionStore,
  secret: sessionSecret,
  key: sessionCookie,
  resave: true,
  saveUninitialized: true
}));

//Integrar las sesiones con SocketIO
io.use(passportSocketIo.authorize({
  cookieParser: cookieParser, 
  key:          sessionCookie,
  secret:       sessionSecret,
  store:        sessionStore
}));

//Inicializar passport
users.initPassport(app);

//Routers
app.use('/', index);
app.use('/users', users.router);
app.use('/bot', bot.router);

//SocketIO routes
index.socketio(io);
bot.socketio(io);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

/**
 * Get port from environment and store in Express.
 */

var port = normalizePort(process.env.PORT || '3000');
app.set('port', port);

module.exports = app;


/**
 * Listen on provided port, on all network interfaces.
 */

server.listen(port);
server.on('error', onError);
server.on('listening', onListening);


/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val) {
  var port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  var bind = typeof port === 'string'
    ? 'Pipe ' + port
    : 'Port ' + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
  var addr = server.address();
  var bind = typeof addr === 'string'
    ? 'pipe ' + addr
    : 'port ' + addr.port;
  console.log('Listening on ' + bind);
}
