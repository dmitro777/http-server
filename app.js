/**
 * Middleware setup
 */
const createError = require('http-errors');
const express = require('express');
const path = require('path');
const logger = require('morgan');
const session = require('express-session');
const passport = require('passport');

const indexRouter = require('./routes/index');
const userRouter = require('./routes/users');
const dishRouter = require('./routes/dishRouter');
const promoRouter = require('./routes/promoRouter');
const leadersRouter = require('./routes/leadersRouter');
const uploadRouter = require('./routes/uploadRouter');
const config = require('./config');
const mongoose = require('mongoose');

const url = config.mongoUrl;
const connect = mongoose.connect(url);
// connecting to conFusion DB
connect.then( (db) => 
    {console.log('Connected correctly to server!')}, 
    (err) => {console.log(err)});

// express engine is ON
const app = express();

/**
 * Redirecting All network traffic to secure port(HTTPS)
 */
app.all('*', (req, res, next) => {

    if (req.secure) {
        next();
    }
    else {
        res.redirect(307, 'https://' + req.hostname + ':' + app.get('secPort') + req.url);
    }
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(passport.initialize());
/**
 * Configuring directories
 */
app.use('/', indexRouter);
app.use('/users', userRouter);
app.use(express.static(path.join(__dirname, 'public')));
app.use('/dishes', dishRouter);
app.use('/leaders', leadersRouter);
app.use('/promotions', promoRouter);
app.use('/imageUpload', uploadRouter);
/**
 * Handling Errors
 */
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
