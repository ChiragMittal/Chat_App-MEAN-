var express = require('express');
var pool = require('./connection');
var app = express();
var morgan = require('morgan');
var bodyParser = require('body-parser');

var Auth = require('./auth.js');

var Session = require('express-session');

var cookieParser = require('cookie-parser');



app.use(cookieParser());

// app.use(session());
var Session = Session({
    secret: 'secrettokenhere',
    saveUninitialized: true,
    resave: true
});
app.use(Session);

app.use(morgan('dev'));
app.use('/Client', express.static(__dirname + '/../Client'));
app.use('/public', express.static(__dirname + '/../public'));


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

var sessionInfo;

Auth(app, pool, Session);



console.log('listening to 3000')
app.listen(3000);