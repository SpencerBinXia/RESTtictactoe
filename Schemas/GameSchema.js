var mongoose = require('mongoose');

//Mongoose Schema for games
var Schema = mongoose.Schema;

var GameSchema = new Schema({
    id: String,
    player: String,
    start_date: Date,
    grid: [{type:String}],
    winner: String
});

exports.Game = mongoose.model('Game', GameSchema);