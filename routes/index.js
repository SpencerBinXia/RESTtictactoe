var express = require('express');
var mongoose = require('mongoose');
var router = express.Router();
var User = require('../Schemas/UserSchema').User;
var Game = require('../Schemas/GameSchema').Game;
var Score = require('../Schemas/ScoreSchema').Score;

var tttGame = require('../controllers/tttGame');

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
    User.findOne({username : session.username}, function(err, foundUser){
        if(err){
            res.send({status: "ERROR"});
        }
        var gameCounter = foundUser.gamesPlayed;
        console.log("initial count" + gameCounter);
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
            gameCounter = gameCounter+1;
            console.log("gameend" + gameCounter);
            playedUserGame(session.username, gameCounter);
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
                gameCounter = gameCounter+1;
                console.log("gameend" + gameCounter);
                playedUserGame(session.username, gameCounter);
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
});

function saveGame(board, winner, username, counter)
{
    var gameId = username + counter;
    var gameDoc = new Game({id: gameId, player: username, start_date: new Date(), grid: board, winner: winner});
    gameDoc.save(function (err) {
        if (err) {
            return 0;
        }
    });
    return 1;
}

function playedUserGame(username, counter)
{
    console.log("playedGame function" + counter);
    console.log("playedGame function" + username);
    User.findOneAndUpdate({username: username}, {gamesPlayed: counter}, function (err, result) {
        if (err){
            return 0;
        }
    });
}

function updateScore(username, winner, counter)
{
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
