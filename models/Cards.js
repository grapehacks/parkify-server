var mongoose = require('mongoose');
var User = require('./Users');


var CardSchema = new mongoose.Schema({
    name: String,
    type: String,
    active: Boolean,
    removed: Boolean,
    user: User
});
mongoose.model('Card', CardSchema);
module.exports = CardSchema;
