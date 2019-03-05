var mongoose = require('mongoose');

//Mongoose Schema for scores
var Schema = mongoose.Schema;

var ScoreSchema = new Schema({
    username: {type: String, unique: true},
    human: Number,
    wopr: Number,
    tie: Number
});

exports.Score = mongoose.model('Score', ScoreSchema);