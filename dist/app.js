"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var cookieParser = require("cookie-parser");
var express = require("express");
var createError = require("http-errors");
var logger = require("morgan");
var path = require("path");
var authorize_1 = require("./routes/authorize");
var calendar_1 = require("./routes/calendar");
var index_1 = require("./routes/index");
var mail_1 = require("./routes/mail");
var users_1 = require("./routes/users");
var app = express();
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/', index_1.default);
app.use('/authorize', authorize_1.default);
app.use('/calendar', calendar_1.default);
app.use('/mail', mail_1.default);
app.use('/users', users_1.default);
// catch 404 and forward to error handler
app.use(function (req, res, next) { return next(createError(404)); });
// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};
    // render the error page
    res.status(err.status || 500);
    res.render('error');
});
module.exports = app;
