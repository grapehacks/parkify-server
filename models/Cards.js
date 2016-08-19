var mongoose = require('mongoose');
var User = require('./Users');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

var CardSchema = new mongoose.Schema({
    _id: ObjectId,
    name: String,
    type: String,
    active: Boolean,
    removed: Boolean,
    user: User
});
mongoose.model('Card', CardSchema);
module.exports = CardSchema;
