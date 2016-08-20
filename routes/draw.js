var express = require('express');
var drawer = require('../services/Drawer.js');

var router = express.Router();

router.put('/draw-date', function (req, res) {
    var dateToSet = req.body;
    drawer
        .setDrawDate(dateToSet.date)
        .then(function () {
            res.json({});
        }).catch(function () {
            res.statusCode(400).json({data: 'Bad request'});
    });
});

module.exports = router;
