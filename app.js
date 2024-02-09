const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');
const MongoClient = require('mongodb').MongoClient;
require('dotenv').config();

MongoClient.connect('mongodb://127.0.0.1:27017').then((client) => {
  console.log('Connected to Database');

  let db = client.db('twitter-clone');

  app.locals.db = db;
});

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const messagesRouter = require('./routes/messages');
const aiRouter = require('./routes/ai');

const app = express();

/* let postsObjects = [
  {
    userName: 'string',
    userMessage: 'string',
    id: 'string',
  },
]; */

app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/messages', messagesRouter);
app.use('/ai', aiRouter);

module.exports = app;
