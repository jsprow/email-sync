import * as cookieParser from 'cookie-parser';
import * as express from 'express';
import * as createError from 'http-errors';
import * as logger from 'morgan';
import * as path from 'path';
import authRouter from './routes/authorize';
import calendarRouter from './routes/calendar';
import indexRouter from './routes/index';
import mailRouter from './routes/mail';
import usersRouter from './routes/users';

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/authorize', authRouter);
app.use('/calendar', calendarRouter);
app.use('/mail', mailRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use((req, res, next) => next(createError(404)));

// error handler
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
