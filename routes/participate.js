var express = require('express');
var mongoose = require('mongoose');
var auth = require('../auth/auth');


var router = express.Router();

/* POST /participate/register */
router.post('/register', function (req, res) {
    var user = req.user;
    if (req.body.rememberLastChoice) {
        user.rememberLastChoice = req.body.rememberLastChoice;
    }
    user.participate = 1;
    user.save(function (err) {
        if (err) {
            res.status(500).json({data: 'User internal error.'});
        }
        res.json(user);
    });
});

/* POST /participate/unregister */
router.post('/unregister', function (req, res) {
    var user = req.user;
    if (req.body.rememberLastChoice) {
        user.rememberLastChoice = req.body.rememberLastChoice;
    }
    user.participate = 0;
    user.save(function (err) {
        if (err) {
            res.status(500).json({data: 'User internal error.'});
        }
        res.json(user);
    });
});

module.exports = router;
