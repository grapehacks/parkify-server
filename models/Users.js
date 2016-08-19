var mongoose = require('mongoose');
var Card = require('./Cards');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

var UserSchema = new mongoose.Schema({
    _id: ObjectId,
    email: String,
    password: String,
    name: String,
    type: {type: Number, default: 0, min: 0, max: 1},
    participate: {type: Number, default: 1, min: 0, max: 2},
    rememberLastChoice: {type: Boolean, default: false},
    removed: Boolean,
    unreadMsgCounter: Number,
    card: Card
});
mongoose.model('User', UserSchema);
module.exports = UserSchema;
