var express = require('express');
var jwt = require('jsonwebtoken');
var mocks = require('../mocks.js');
var mongoose = require('mongoose');

var User = mongoose.model('User', require('../models/Users.js'));

var router = express.Router();

/* GET /users listing. */
router.get('/ping', function(req, res, next) {
    //TODO: implement
    res.json(mocks.getter.ping);
});

router.get('/draw', function(req, res, next) {
    //TODO: implement
    res.json(mocks.getter.draw);
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
                    user: user,
                    token: token
                });
            }
        }
    })
});


module.exports = router;