var mongoose = require('mongoose');
var User = require('./Users');
var Draw = require('./Draws');

var HistorySchema = new mongoose.Schema({
    date: {type: Date, default: Date.now},
    winners: [{type: mongoose.Schema.Types.ObjectId, ref: 'Draw'}],
    users: [{type: mongoose.Schema.Types.ObjectId, ref: 'User'}],
    specialCases: []
});

mongoose.model('History', HistorySchema);
module.exports = HistorySchema;
