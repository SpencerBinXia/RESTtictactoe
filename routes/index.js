var express = require('express');
var mongoose = require('mongoose');
var router = express.Router();
var User = require('../Schemas/UserSchema').User;

var tttGame = require('../controllers/tttGame');

//Mongoose Schema for games
var Schema = mongoose.Schema;

var GameSchema = new Schema({
    id: String,
    start_date: Date,
    grid: [{type:String}],
    winner: String
});

var Game = mongoose.model('Game', GameSchema);

//Mongoose Schema for scores
var ScoreSchema = new Schema({
    username: {type: String, unique: true},
    human: Number,
    wopr: Number,
    tie: Number
});

var Score = mongoose.model('Score', ScoreSchema);

/* GET home page. */
router.get('/ttt', function(req, res, next)  {
    if (req.session.username){
        var today = new Date().toLocaleString();
        res.render('index', {title: 'Tic Tac Toe', name: req.session.username, date: today});
    }
    else
        {
        res.render('index', {title: 'Tic Tac Toe'});
    }
});

/*
POST home page once name is entered.
router.post('/ttt', function(req, res, next) {
    var name = req.body.name;
    var today = new Date().toLocaleString();
    res.render('index', {title: 'Tic Tac Toe', name: name, date: today});
});
*/

/* API endpoint for TicTacToe JSON */
router.post('/ttt/play', function(req,res, next) {
    var session = req.session;
    console.log(session.grid);

    //Gets the amount of games the user has played
    var counterQuery = User.findOne({username : session.username}, function(err, foundUser){
        if(err){
            res.send({status: "ERROR"});
        }
        var gameCounter = foundUser.gamesPlayed;

    });
    counterQuery.then(function (doc){
        gameCounter = doc.gamesPlayed;
    });
    console.log(gameCounter);

    //New grid if current grid is undefined
    if (session.grid === undefined)
    {
        session.grid = [" "," "," "," "," "," "," "," "," "];
    }
    var board = {grid: session.grid, winner: " "};
    var move = req.body.move;
    console.log(move);
    if (move === null)
    {
        console.log("!move reached");
        res.status(200).send(board);
    }
    else
    {
        board.grid[move] = "X";
    }
    console.log(board);
    //console.debug(board);
    var winCell = tttGame.winner(board.grid);
    //console.log(winCell);
    if (winCell === "X" || winCell === "O" || winCell === 't')
    {
        var playedQuery = playedUserGame(session.name);
        console.log("finished game counter" + gameCounter);
        var gameBool = saveGame(board.grid, winCell, session.username, gameCounter);
        var scoreBool = updateScore(session.username, winCell, gameCounter);
        if (gameBool === 0 || scoreBool === 0)
        {
            res.send({status: "ERROR"});
        }
        board["winner"] = winCell;
        req.session.grid = undefined;
        console.log(board);
        res.status(200).send(board);
    }
    else
    {
        var newboard = tttGame.play(board.grid);
        winCell = tttGame.winner(board.grid);
        board["grid"] = newboard;
        board["winner"] = winCell;
        if (winCell === "X" || winCell === "O" || winCell === 't')
        {
            gameCounter = playedUserGame(session.name);
            console.log("finished game counter" + gameCounter);
            var gameBool = saveGame(board.grid, winCell, session.username, gameCounter);
            var scoreBool = updateScore(session.username, winCell, gameCounter);
            if (gameBool === 0 || scoreBool === 0)
            {
                res.send({status: "ERROR"});
            }
            req.session.grid = undefined;
        }
        console.log(board);
        res.status(200).send(board);
    }
    //var newgrid = JSON.stringify({grid: board, winner: winCell});
    //console.log(newgrid);;
});

function saveGame(board, winner, username, counter)
{
    var gameId = username + counter;
    var gameDoc = new Game({id: gameId, start_date: new Date(), grid: board, winner: winner});
    gameDoc.save(function (err) {
        if (err) {
            return 0;
        }
    });
    return 1;
}

function playedUserGame(username)
{
    User.findOneAndUpdate({username: username}, {$inc: {gamesPlayed: 1}}, function (err, result) {
        if (err || !result){
            return 0;
        }
        else
        {
            return result.gamesPlayed;
        }
    });
}
function updateScore(username, winner, counter)
{
    var gameCounter;
    User.findOne({username : username}, function(err, foundUser){
        if(err){
            res.send({status: "ERROR"});
        } else {
            gameCounter = foundUser.gamesPlayed;
        }
    });
    if (counter === 1)
    {
        var ScoreDoc = new Score({username: username, human: 0, wopr: 0, tie: 0});
        ScoreDoc.save(function (err) {
            if (err) {
                return 0;
            }
        });
    }
    if (winner === "X")
    {
        Score.findOneAndUpdate({username: username}, {$inc: {human: 1}}, function (err, result) {
            if (err || !result) {
                return 0;
            }
        });
    }
    else if (winner === "O")
    {
        Score.findOneAndUpdate({username: username}, {$inc: {wopr: 1}}, function (err, result) {
            if (err || !result) {
                return 0;
            }
        });
    }
    else if (winner === "t")
    {
        Score.findOneAndUpdate({username: username}, {$inc: {tie: 1}}, function (err, result) {
            if (err || !result) {
                return 0;
            }
        });
    }
    return 1;
}

/* Old /ttt/play
router.post('/ttt/play', function(req,res, next) {
    // console.log(req.body);
    var board = req.body;

    //console.debug(board);
    var winCell = tttGame.winner(board.grid);
    //console.log(winCell);
    if (winCell === "X" || winCell === "O")
    {
        board["winner"] = winCell;
        res.status(200).send(board);
    }
    else
    {
        var newboard = tttGame.play(board.grid);
        winCell = tttGame.winner(board.grid);
        board["grid"] = newboard;
        board["winner"] = winCell;
        res.status(200).send(board);
    }
    //var newgrid = JSON.stringify({grid: board, winner: winCell});
    //console.log(newgrid);;
});
*/
module.exports = router;
