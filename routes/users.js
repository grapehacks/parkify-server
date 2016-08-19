var express = require('express');
var router = express.Router();

var User = require('../models/Users.js');
var mocks = require('../mocks.js');

/* GET /users listing. */
router.get('/', function(req, res, next) {
  User.find(function (err, users) {
    if (err) return next(err);
    res.json(users);
  });
});

///* POST /users */
//router.post('/', function(req, res, next) {
//  User.create(req.body, function (err, post) {
//    if (err) return next(err);
//    res.json(post);
//  });
//});

/* GET /users/id */
router.get('/:id', function(req, res, next) {

  //TODO: MOCK
    res.json(mocks.get.users);


  //User.findById(req.params.id, function (err, post) {
  //  if (err) return next(err);
  //  res.json(post);
  //});
});

///* PUT /users/:id */
//router.put('/:id', function(req, res, next) {
//  User.findByIdAndUpdate(req.params.id, req.body, function (err, post) {
//    if (err) return next(err);
//    res.json(post);
//  });
//});
//
///* DELETE /users/:id */
//router.delete('/:id', function(req, res, next) {
//  User.findByIdAndRemove(req.params.id, req.body, function (err, post) {
//    if (err) return next(err);
//    res.json(post);
//  });
//});

module.exports = router;
