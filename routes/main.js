var express = require('express');
var jwt = require('jsonwebtoken');
var mocks = require('../mocks.js');
var mongoose = require('mongoose');

var User = mongoose.model('User', require('../models/Users.js'));
var DrawDate = mongoose.model('DrawDate', require('../models/DrawDate.js'));

var router = express.Router();

/* GET /users listing. */
router.get('/ping', function(req, res, next) {
    DrawDate.findOne({}, function (err, drawDate) {
        var ping = { date: undefined };
       if (!drawDate) {
            ping.date = drawDate.date;
       }

        res.json(ping);
    });

});

router.post('/authenticate', function(req, res) {
    User.findOne({
        email: req.body.email
    }, function (err, user) {
        if (err) throw err;

        if (!user) {
            res.status(403).json({message: 'Auth failed. User not found.'});
        } else  {
            if (user.password != req.body.password) {
                res.status(403).json({message: 'Auth failed. Password incorrect.'});
            } else {
                var token = jwt.sign({_id: user._id}, req.app.get('jwtTokenSecret'), {
                    expiresIn: 60*60*24 //expires 24 hours
                });

                res.json({
                    message: 'Auth succeeded',
                    token: token
                });
            }
        }
    })
});

// route middleware to verify a token
router.use(function(req, res, next) {

    // check header or url parameters or post parameters for token
    var token = req.body.token || req.query.token || req.headers['x-access-token'];

    // decode token
    if (token) {

        // verifies secret and checks exp
        jwt.verify(token, req.app.get('jwtTokenSecret'), function(err, decoded) {
            if (err) {
                return res.status(401).json({message: 'Unauthorized access.' });
            } else {
                // if everything is good, save to request for use in other routes
                req.decoded = decoded;
                next();
            }
        });

    } else {

        // if there is no token
        // return an error
        return res.status(403).send({
            message: 'No token provided.'
        });

    }
});

module.exports = router;