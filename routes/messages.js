var express = require('express');
var mongoose = require('mongoose');

var router = express.Router();

var Message = mongoose.model('Message', require('../models/Messages.js'));

/* GET /messages listing. */
router.get('/', function (req, res) {
    Message.find({'user': req.user._id},function (err, messages) {
        if (err) {
            res.status(500).json({data: 'Internal card error'});
        }
        res.json(messages);
    });
});

/* PUT /messages/:id */
router.post('/:id/read', function (req, res) {
    var data = {read: true};
    Message.findByIdAndUpdate(req.params.id, data, {new: true}, function (err, message) {
        if (err) {
            res.status(404).json({data: 'Message not found.'});
        }
        res.json(message);
    });
});

//router.post('/', function (req, res) {
//    req.body.user = req.user;
//    console.log(req.body);
//    Message.create(req.body, function (err, post) {
//        if (err) {
//            console.log(post, err);
//            res.status(400).json({data: 'Bad request.'});
//        }
//        res.json(post);
//    });
//});


module.exports = router;
