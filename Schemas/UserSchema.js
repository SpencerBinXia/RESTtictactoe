var mongoose = require('mongoose');

//Mongoose User Schema
var Schema = mongoose.Schema;

var UserSchema = new Schema({
    username: {type: String, unique: true},
    password: String,
    email: {type: String, unique: true},
    active: Boolean,
    key: String,
    gamesPlayed: Number
});

exports.User = mongoose.model('User', UserSchema);