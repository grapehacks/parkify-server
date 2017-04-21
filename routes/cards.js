var express = require('express');
var mongoose = require('mongoose');
var auth = require('../auth/auth');
var router = express.Router();

var ObjectId = mongoose.Types.ObjectId;
var Card = mongoose.model('Card', require('../models/Cards.js'));

/* GET /cards listing. */
router.get('/', auth.hasRole('admin'), function (req, res) {
    Card.find(function (err, cards) {
        if (err) {
            return res.status(500).json({data: 'Internal card error'});
        }
        res.json(cards);
    });
});

/* GET /users/like?name listing users with name 'like' something */
router.get('/like', auth.hasRole('admin'), function (req, res) {
    Card.find({name: new RegExp(req.query.name, 'i')}, '-salt -hashedPassword', function (err, cards) {
        if (err) {
            return res.status(500).json({data: 'Internal card error.'});
        }
        res.json(cards);
    });
});

/* POST /cards */
router.post('/', auth.hasRole('admin'), function (req, res) {
    Card.create(req.body, function (err, post) {
        if (err) {
            return res.status(400).json({data: 'Bad request.'});
        }
        res.json(post);
    });
});

/* GET /cards/id */
router.get('/:id', auth.hasRole('admin'), function (req, res) {
    Card.findById(req.params.id, function (err, post) {
        if (err) {
            return res.status(404).json({data: 'Card not found.'});
        }
        res.json(post);
    });
});

/* PUT /cards/:id */
router.put('/:id', auth.hasRole('admin'), function (req, res) {
    delete req.body._id;
    Card.findByIdAndUpdate(req.params.id, req.body, {new: true}, function (err, post) {
        if (err) {
            return res.status(404).json({data: 'Card not found.'});
        }
        res.json(post);
    });
});

/* DELETE /cards/:id */
router.delete('/:id', auth.hasRole('admin'), function (req, res) {
    Card.findByIdAndRemove(req.params.id, req.body, function (err, card) {
        if (err) {
            return res.status(404).json({data: 'Card not found.'});
        }

        return res.status(200).json({});
    });
});

module.exports = router;
