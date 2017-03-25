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
        res.send(200);
    } else {
        next();
    }
});

app.use('/', main);
app.use('/api/users', users);
app.use('/api/users/:id/licence', auth.verifyAuthentication(true), users);
app.use('/api/cards', auth.hasRole('admin'), cards);
app.use('/api/history', history);
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


if (false) {
    var User = mongoose.model('User', require('./models/Users.js'));
    User.find({}).remove(function() {
        console.log("Init users");
        User.create(
            {
                name: 'Admin',
                email: 'admin',
                licenceNumber: 'KRA AA01',
                password: 'admin',
                type: 1
            },
            {
                name: 'Ćwięk Tomasz',
                email: 'tocw@grapeup.com',
                licenceNumber: 'KRA AA02',
                password: 'pass',
                type: 0
            },
            {
                name: 'Darkowski Michał',
                email: 'mida@grapeup.com',
                licenceNumber: 'KRA AA03',
                password: 'pass',
                type: 0
            },
            {
                name: 'Derwisz Sławomir',
                email: 'slde@grapeup.com',
                licenceNumber: 'KRA AA04',
                password: 'pass',
                type: 0
            },
            {
                name: 'Gomoła Wojciech',
                email: 'wogo@grapeup.com',
                licenceNumber: 'KRA AA05',
                password: 'pass',
                type: 0
            },
            {
                name: 'Ścisłowicz Tomasz',
                email: 'tosc@grapeup.com',
                licenceNumber: 'KRA AA06',
                password: 'pass',
                participate: 0,
                type: 0
            },
            {
                name: 'Krzemień Anna',
                email: 'ankr@grapeup.com',
                licenceNumber: 'KRA AA07',
                password: 'pass',
                participate: 0,
                type: 0
            },
            {
                name: 'Cabaj Marek',
                email: 'maca@grapeup.com',
                licenceNumber: 'KRA AA08',
                password: 'pass',
                participate: 0,
                type: 0
            },
            {
                name: 'Orlikowska Magda',
                email: 'mata@grapeup.com',
                licenceNumber: 'KRA AA09',
                password: 'pass',
                type: 0
            },
            {
                name: 'Mikuś Dominika',
                email: 'domi@grapeup.com',
                licenceNumber: 'KRA AA10',
                password: 'pass',
                type: 0
            },
            {
                name: 'Mazur Paweł',
                email: 'pamz@grapeup.com',
                licenceNumber: 'KRA AA11',
                password: 'pass',
                type: 0
            },
            {
                name: 'Janicki Damian',
                email: 'daja@grapeup.com',
                licenceNumber: 'KRA AA12',
                password: 'pass',
                type: 0
            },
            {
                name: 'Skrzyszewski Krzysztof',
                email: 'krsk@grapeup.com',
                licenceNumber: 'KRA AA13',
                password: 'pass',
                type: 0
            },
            {
                name: 'Zając Bartollini',
                email: 'baza@grapeup.com',
                licenceNumber: 'KRA AA14',
                password: 'pass',
                type: 0
            },
            {
                name: 'Toś Marcin',
                email: 'mato@grapeup.com',
                licenceNumber: 'KRA AA15',
                password: 'pass',
                type: 0
            },
            {
                name: 'Klimek Tomasz',
                email: 'tokl@grapeup.com',
                licenceNumber: 'KRA AA16',
                password: 'pass',
                type: 0
            },
            {
                name: 'Ruszczak Marek',
                email: 'maru@grapeup.com',
                licenceNumber: 'KRA AA17',
                password: 'pass',
                type: 0
            },
            {
                name: 'Tymchuk Pavlo',
                email: 'paty@grapeup.com',
                licenceNumber: 'KRA AA18',
                password: 'pass',
                participate: 0,
                type: 0
            }
        );
    });

    var Card = mongoose.model('Card', require('./models/Cards.js'));
    Card.find({}).remove(function() {
        console.log("Init cards");
        Card.create(
            {
                name: 'Card D1',
                type: 'd'
            },
            {
                name: 'Card D2',
                type: 'd'
            },
            {
                name: 'Card D3',
                type: 'd'
            },
            {
                name: 'Card D4',
                type: 'd'
            },
            {
                name: 'Card D5',
                type: 'd'
            },
            {
                name: 'Card B1',
                type: 'b'
            },
            {
                name: 'Card B2',
                type: 'b'
            },
            {
                name: 'Card B3',
                type: 'b'
            },
            {
                name: 'Card B4',
                type: 'b'
            },
            {
                name: 'Card B5',
                type: 'b'
            }
        );
    });

    var History = mongoose.model('History', require('./models/History.js'));
    History.find({}).remove(function(){
        console.log("Removed history");
    });

    var Messages = mongoose.model('Messages', require('./models/Messages.js'));
    Messages.find({}).remove(function(){
        console.log("Removed messages");
    });

    var DrawDate = mongoose.model('DrawDate', require('./models/DrawDate.js'));
    DrawDate.find({}).remove(function(){
        console.log("Removed draw dates");
    });
}

module.exports = app;
