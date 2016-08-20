var mongoose = require('mongoose');

var HistorySchema = new mongoose.Schema({
    date: {type: Date, default: Date.now},
    winners: [{
        user: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
        card: {type: mongoose.Schema.Types.ObjectId, ref: 'Card'}
    }],
    users: [{type: mongoose.Schema.Types.ObjectId, ref: 'User'}],
    specialCases: []
});

mongoose.model('History', HistorySchema);
module.exports = HistorySchema;
