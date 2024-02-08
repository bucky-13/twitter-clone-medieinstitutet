var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors');
let MongoClient = require('mongodb').MongoClient;
require('dotenv').config();

MongoClient.connect('mongodb://127.0.0.1:27017').then((client) => {
  console.log('Connected to Database');

  let db = client.db('twitter-clone');

  app.locals.db = db;
});

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var messagesRouter = require('./routes/messages');

var app = express();

let postsObjects = [
  {
    userName: 'string',
    userMessage: 'string',
    id: 'string',
  },
];

app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/messages', messagesRouter);

app.get("/test", (req, res) => {
  res.send("test")
})

module.exports = app;
