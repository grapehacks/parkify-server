var express = require('express');
var mongoose = require('mongoose');

var router = express.Router();

var ObjectId = mongoose.Types.ObjectId;
var Card = mongoose.model('Card', require('../models/Cards.js'));

/* GET /cards listing. */
router.get('/', function (req, res) {
    Card.find(function (err, cards) {
        if (err) {
            res.status(500).json({data: 'Internal card error'});
        }
        res.json(cards);
    });
});

/* POST /cards */
router.post('/', function (req, res) {
    Card.create(req.body, function (err, post) {
        if (err) {
            res.status(400).json({data: 'Bad request.'});
        }
        res.json(post);
    });
});

/* GET /cards/id */
router.get('/:id', function (req, res) {
    Card.findById(req.params.id, function (err, post) {
        if (err) {
            res.status(404).json({data: 'Card not found.'});
        }
        res.json(post);
    });
});

/* PUT /cards/:id */
router.put('/:id', function (req, res) {
    Card.findByIdAndUpdate(req.params.id, req.body, {new: true}, function (err, post) {
        if (err) {
            res.status(404).json({data: 'Card not found.'});
        }
        res.json(post);
    });
});

/* DELETE /cards/:id */
router.delete('/:id', function (req, res) {
    Card.findById(req.params.id, req.body, function (err, card) {
        if (err) {
            res.status(404).json({data: 'Card not found.'});
        }
        card.removed = true;
        card.save(function (err) {
            if (err) {
                res.status(500).json({data: 'Card internal error.'});
            }
            res.json(card);
        });
    });
});

module.exports = router;
