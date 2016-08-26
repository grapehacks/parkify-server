var express = require('express');
var mongoose = require('mongoose');
var config = require('../config');

var router = express.Router();

var Message = mongoose.model('Message', require('../models/Messages.js'));

/* GET /messages listing. */
router.get('/', function (req, res) {
    var counter = req.query.count || config.defaultNumberOfMessagesToReturn;
    Message.find({'user': req.user._id}).sort({'date': -1}).limit(counter).exec(function (err, messages) {
        if (err) {
            return res.status(500).json({data: 'Internal card error'});
        }
        return res.json(messages);
    });
});

/* PUT /messages/:id */
router.post('/:id/read', function (req, res) {
    var data = {read: true};

    Message.findByIdAndUpdate(req.params.id, data, {new: true}, function (err, message) {
        if (err) {
            res.status(404).json({data: 'User not found.'});
        }
        req.user.unreadMsgCounter = req.user.unreadMsgCounter ? req.user.unreadMsgCounter - 1 : 0;
        req.user.save(function (err) {
            if (err) {
                return res.status(500).json({data: 'User error'});
            }
            return res.json(message);
        });
    });
});

module.exports = router;
