require('dotenv').load();
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');

var logger = require('morgan');
var mongoose = require('mongoose');
var passport = require('passport');
var User = require('./models/user');

mongoose.Promise = require('bluebird');
mongoose.connect(process.env.DB_URL, { promiseLibrary: require('bluebird') })
  .then(() =>  console.log('Connected to MongoDB database'))
  .catch((err) => console.error(err));

var apiRoutes = require('./routes/api');
var userRoutes = require('./routes/user');
var flashcardRoutes = require('./routes/flashcard');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "POST, GET, OPTIONS, PUT, DELETE");
    res.header("Access-Control-Allow-Headers", "Authorization, Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(passport.initialize());

app.use('/api/', apiRoutes);
app.use('/api/user', userRoutes);
app.use('/api/flashcard', flashcardRoutes);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
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

module.exports = app;
