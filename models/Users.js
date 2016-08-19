var mongoose = require('mongoose');

var UserSchema = new mongoose.Schema({
    email: String,
    password: String,
    name: String,
    type: {type: Number, default: 0, min: 0, max: 1},
    participate: {type: Number, default: 1, min: 0, max: 2},
    rememberLastChoice: {type: Boolean, default: false},
    removed: Boolean,
    unreadMsgCounter: Number
});

module.exports = mongoose.model('User', UserSchema);
