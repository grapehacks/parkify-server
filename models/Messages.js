var mongoose = require('mongoose');

var MessageSchema = new mongoose.Schema({
    text: String,
    topic: String,
    type: {type: Number, default: 4, min: 0, max: 6},
    read: {type: Boolean, default: false},
    date: {type: Date, default: Date.now},
    user: {type: mongoose.Schema.Types.ObjectId, ref: 'User'}
});

mongoose.model('Message', MessageSchema);
module.exports = MessageSchema;
