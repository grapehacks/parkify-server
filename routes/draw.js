var express = require('express');
var drawer = require('../services/Drawer.js');
var auth = require('../auth/auth');

var router = express.Router();

//var User = mongoose.model('User', require('../models/Users.js'));
var mocks = require('../mocks.js');

/* GET /draw listing. */
router.get('/', function (req, res) {

    res.json(mocks.getter.draw);

    //User.find(function (err, users) {
    //  if (err) {
    //    res.send(err);
    //  }
    //    res.json(users);
    //});
});

router.put('/draw-date', auth.hasRole('admin'), function (req, res) {
    var dateToSet = req.body;
    drawer
        .setDrawDate(new Date(dateToSet.date))
        .then(function () {
            res.json({});
        }).catch(function () {
            res.statusCode(400).json({data: 'Bad request'});
    });
});
//
///* POST /users */
//router.post('/', function (req, res) {
//    console.log(req.body);
//    User.create(req.body, function (err, post) {
//      if (err) {
//        res.send(err);
//      }
//        res.json(post);
//    });
//    //res.json('OK');
//});
//
///* GET /users/id */
//router.get('/:id', function (req, res) {
//    User.findById(req.params.id, function (err, post) {
//      if (err) {
//        res.send(err);
//      }
//        res.json(post);
//    });
//});
//
///* PUT /users/:id */
//router.put('/:id', function (req, res) {
//    User.findByIdAndUpdate(req.params.id, req.body, function (err, post) {
//      if (err) {
//        res.send(err);
//      }
//        res.json(post);
//    });
//});
//
///* DELETE /users/:id */
//router.delete('/:id', function (req, res) {
//    User.findByIdAndRemove(req.params.id, req.body, function (err, post) {
//      if (err) {
//        res.send(err);
//      }
//        res.json(post);
//    });
//});

module.exports = router;
