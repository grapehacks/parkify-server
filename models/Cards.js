var mongoose = require('mongoose');
var User = require('./Users');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

var CardSchema = new mongoose.Schema({
    name: {type: String, unique: true, required: true},
    type: String,
    active: {type: Boolean, default: true},
    removed: {type: Boolean, default: false},
    user: {type: mongoose.Schema.Types.ObjectId, ref: 'User'}
});
mongoose.model('Card', CardSchema);
module.exports = CardSchema;
