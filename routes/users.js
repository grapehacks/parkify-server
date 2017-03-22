var express = require('express');
var mongoose = require('mongoose');
var auth = require('../auth/auth');
var router = express.Router();

var ObjectId = mongoose.Types.ObjectId;
var User = mongoose.model('User', require('../models/Users.js'));

/* GET /users listing. */
router.get('/', auth.hasRole('admin'), function (req, res) {
    User.find({}, '-salt -hashedPassword', function (err, users) {
        if (err) {
            return res.status(500).json({data: 'Internal user error.'});
        }
        res.json(users);
    });
});

/* POST /users */
router.post('/', auth.hasRole('admin'), function (req, res) {
    User.create(req.body, function (err, post) {
        if (err) {
            console.log(err);
            return res.status(400).json({data: 'Bad request'});
        }
        post.hashedPassword = undefined;
        post.salt = undefined;
        User.find({'email':post.email}, '-salt -hashedPassword', function (err, user) {
            if (err) {
                return res.status(404).json({data: 'User not found.'});
            }
            res.json(user);
        });
    });
});

/* GET /users/id */
router.get('/:id', auth.hasRole('admin'), function (req, res) {
    User.findById(req.params.id, '-salt -hashedPassword', function (err, post) {
        if (err) {
            return res.status(404).json({data: 'User not found.'});
        }
        res.json(post);
    });
});

/* PUT /users/:id */
router.put('/:id', auth.hasRole('admin'), function (req, res) {
    User.findByIdAndUpdate(req.params.id, req.body, {new: true}, function (err, post) {
        if (err) {
            return res.status(404).json({data: 'User not found.'});
        }
        post.hashedPassword = undefined;
        post.salt = undefined;
        res.json(post);
    });
});

/* PUT /users/:id/licence - change users licence number */
router.put('/:id/licence', auth.verifyAuthentication(true), function (req, res) {
    User.findByIdAndUpdate(req.params.id, {licenceNumber: req.body.licenceNumber}, {new: true}, function (err, post) {
        if (err && err.code === 11000 || err && err.code === 11001) {
            return res.status(400).json({data: 'Duplicate licence number.'});
        } else if(err) {
            return res.status(404).json({data: 'User not found.'});
        }
        post.hashedPassword = undefined;
        post.salt = undefined;
        res.json(post);
    });
});

/* DELETE /users/:id */
router.delete('/:id', auth.hasRole('admin'), function (req, res) {
    User.findById(req.params.id, '-salt -hashedPassword', function (err, user) {
        if (err) {
            return res.status(404).json({data: 'User not found.'});
        }
        user.removed = true;
        user.save(function (err) {
            if (err) {
                return res.status(500).json({data: 'User internal error.'});
            }
            res.json(user);
        });
    });
});

module.exports = router;
