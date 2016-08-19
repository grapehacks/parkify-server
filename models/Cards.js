var mongoose = require('mongoose');

var CardSchema = new mongoose.Schema({
    name: String,
    type: String,
    active: Boolean,
    removed: Boolean,
    user: Schema.Types.User
});

module.exports = mongoose.model('Card', CardSchema);
