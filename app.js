var express = require('express');
var path = require('path');
var logger = require('morgan');
var jwt = require('jsonwebtoken');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var users = require('./routes/users');
var cards = require('./routes/cards');
var history = require('./routes/history');
var draw = require('./routes/draw');
var messages = require('./routes/messages');
var participate = require('./routes/participate');
var main = require('./routes/main');
var config = require('./config');
var auth = require('./auth/auth');


var router = express.Router();

// load mongoose package
var mongoose = require('mongoose');

// Use native Node promises
mongoose.Promise = global.Promise;

// connect to MongoDB
mongoose.connect(config.database).then(function () {
    console.log('connected to DB');
}).catch(function (err) {
    console.error(err)
});


var app = express();
app.use(express['static'](__dirname + '/public'));
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');
app.set('jwtTokenSecret', config.secret);
app.set('userRoles', config.userRoles);

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//MIDDLEWARE TO LOG REQUESTS
app.use(function (req, res, next) {
    console.log('Received request. Body:', req.body);
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, x-access-token, Content-Type, Accept");
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    if ('OPTIONS' == req.method) {
        res.status(200);
    } else {
        next();
    }
});

app.use('/', main);
app.use('/api/users', auth.hasRole('admin'), users);
app.use('/api/cards', auth.hasRole('admin'), cards);
app.use('/api/history', auth.hasRole('admin'), history);
app.use('/api/draw', auth.hasRole('admin'), draw);

app.use('/api/participate', auth.verifyAuthentication(true), participate);
app.use('/api/messages', auth.verifyAuthentication(true), messages);


// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function (err, req, res, next) {
        res.status(err.status || 500);
        console.log('oj', err)
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    console.log('oj2', err);
});


module.exports = app;
