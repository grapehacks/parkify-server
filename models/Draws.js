var mongoose = require('mongoose');
var Card = require('./Cards');
var User = require('./Users')
var Draws = require('./Draws');

var DrawSchema = new mongoose.Schema({
    winner: User,
    card: Card
});

mongoose.model('Draw', DrawSchema);
module.exports = DrawSchema;


