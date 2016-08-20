var mongoose = require('mongoose');

var DrawDateSchema = new mongoose.Schema({
    date: { type:Date }
});

mongoose.model('DrawDate', DrawDateSchema);
module.exports = DrawDateSchema;