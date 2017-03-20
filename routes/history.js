var express = require('express');
var mongoose = require('mongoose');

var router = express.Router();

var History = mongoose.model('History', require('../models/History.js'));

/* GET /history/last */
router.get('/last', function (req, res) {
    History.findOne({}, {}, { sort: {'date': -1}})
        .populate('winners.user')
        .populate('winners.card')
        .exec(function (err, last) {
            if (err) {
                return res.status(500).json({data: 'Internal history error'});
            } else if(!err && !last) {
                last = {};
            }
            res.json(last);
        });
});

/* GET /history listing. */
router.get('/', function (req, res) {
    var counter = req.query.count || 10;
    History.find().sort({'date': -1}).limit(counter).exec(function (err, history) {
        if (err) {
            return res.status(500).json({data: 'Internal history error'});
        }
        res.json(history);
    });
});


module.exports = router;
