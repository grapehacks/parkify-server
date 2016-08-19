var mongoose = require('mongoose');
var User = require('./Users');
var Card = require('./Cards');

var DrawSchema = new mongoose.Schema({
    card: Card,
    user: User
});
mongoose.model('Draw', DrawSchema);
module.exports = DrawSchema;
