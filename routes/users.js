var express = require('express');
var mongoose = require('mongoose');


var router = express.Router();

var ObjectId = mongoose.Types.ObjectId;
var User = mongoose.model('User', require('../models/Users.js'));

/* GET /users listing. */
router.get('/', function (req, res) {
    User.find(function (err, users) {
      if (err) {
        res.send(err);
      }
        res.json(users);
    });
});

/* POST /users */
router.post('/', function (req, res) {
    var data = req.body;
    data._id = new ObjectId();
    User.create(req.body, function (err, post) {
      if (err) {
        res.send(err);
      }
        res.json(post);
    });
});

/* GET /users/id */
router.get('/:id', function (req, res) {
    User.findById(req.params.id, function (err, post) {
      if (err) {
        res.send(err);
      }
        res.json(post);
    });
});

/* PUT /users/:id */
router.put('/:id', function (req, res) {
    User.findByIdAndUpdate(req.params.id, req.body, {new: true}, function (err, post) {
      if (err) {
        res.send(err);
      }
        res.json(post);
    });
});

/* DELETE /users/:id */
router.delete('/:id', function (req, res) {
    User.findByIdAndRemove(req.params.id, req.body, function (err, post) {
      if (err) {
        res.send(err);
      }
        res.json(post);
    });
});

module.exports = router;
