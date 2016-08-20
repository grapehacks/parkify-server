var mongoose = require('mongoose');

var DrawDateSchema = new mongoose.Schema({
    date: {type: Date, default: Date.now}
});

mongoose.model('DrawDate', DrawDateSchema);
module.exports = DrawDateSchema;