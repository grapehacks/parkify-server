var express = require('express');
var mongoose = require('mongoose');


var router = express.Router();

var ObjectId = mongoose.Types.ObjectId;
var User = mongoose.model('User', require('../models/Users.js'));

/* GET /users listing. */
router.get('/', function (req, res) {
    User.find({}, '-salt -hashedPassword', function (err, users) {
        if (err) {
            res.status(500).json({data: 'Internal user error.'});
        }
        res.json(users);
    });
});

/* POST /users */
router.post('/', function (req, res) {
    console.log(req.body);
    User.create(req.body, function (err, post) {
        if (err) {
            console.log(err);
            res.status(400).json({data: 'Bad request'});
        }
        post.hashedPassword = undefined;
        post.salt = undefined;
        res.json(post);
    });
});

/* GET /users/id */
router.get('/:id', function (req, res) {
    User.findById(req.params.id, '-salt -hashedPassword', function (err, post) {
        if (err) {
            res.status(404).json({data: 'User not found.'});
        }
        res.json(post);
    });
});

/* PUT /users/:id */
router.put('/:id', function (req, res) {
    User.findByIdAndUpdate(req.params.id, req.body, {new: true}, function (err, post) {
        if (err) {
            res.status(404).json({data: 'User not found.'});
        }
        post.hashedPassword = undefined;
        post.salt = undefined;
        res.json(post);
    });
});

/* DELETE /users/:id */
router.delete('/:id', function (req, res) {
    User.findById(req.params.id, '-salt -hashedPassword', function (err, user) {
        if (err) {
            res.status(404).json({data: 'User not found.'});
        }
        user.removed = true;
        user.save(function (err) {
            if (err) {
                res.status(500).json({data: 'User internal error.'});
            }
            res.json(user);
        });
    });
});

module.exports = router;
