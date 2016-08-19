var express = require('express');
var mocks = require('../mocks.js');
var router = express.Router();

/* GET /users listing. */
router.get('/ping', function(req, res, next) {
    //TODO: implement
    res.json(mocks.getter.ping);
});

module.exports = router;