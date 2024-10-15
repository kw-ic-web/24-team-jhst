var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var db = require('./config/db');

var indexRouter = require('./game/routes/index');
var usersRouter = require('./member/routes/users');
var rankingsRouter =require('./game/routes/rankings');
var tableRouter =require('./game/routes/table');

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/game/rankings', rankingsRouter);
app.use('/game/initialize', tableRouter);

module.exports = app;
