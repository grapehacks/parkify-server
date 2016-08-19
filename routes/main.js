var express = require('express');
var mocks = require('../mocks.js');
var router = express.Router();

/* GET /users listing. */
router.get('/ping', function(req, res, next) {
    //TODO: implement
    res.json(mocks.getter.ping);
});

router.get('/draw', function(req, res, next) {
    //TODO: implement
    res.json(mocks.getter.draw);
});

module.exports = router;