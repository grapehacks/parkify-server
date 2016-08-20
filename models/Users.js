var mongoose = require('mongoose');
var Card = require('./Cards');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

var UserSchema = new mongoose.Schema({
    email: {type: String, unique: true, required: true},
    password: {type: String, required: true},
    name: {type: String, unique: true, required: true},
    type: {type: Number, default: 0, min: 0, max: 1},
    participate: {type: Number, default: 1, min: 0, max: 2},
    rememberLastChoice: {type: Boolean, default: false},
    removed: Boolean,
    unreadMsgCounter: {type: Number, default: 0, min: 0},
    card: {type: mongoose.Schema.Types.ObjectId, ref: 'Card'}
});
mongoose.model('User', UserSchema);
module.exports = UserSchema;
