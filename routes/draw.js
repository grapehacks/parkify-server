var express = require('express');
var drawer = require('../services/Drawer.js');

var router = express.Router();

router.put('/draw-date', function (req, res) {
    var dateToSet = req.body;
    drawer
        .setDrawDate(dateToSet.date)
        .then(function () {
            console.log("Success");
            res.json({});
        }).catch(function () {
            console.log("Fail");
            res.status(400).json({data: 'Bad request'});
    });
});

router.get('/start', function (req, res) {
    drawer.draw();
    res.json({});
});

module.exports = router;
