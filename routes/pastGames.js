var express = require('express');
var mongoose = require('mongoose');
var nodeMailer = require('nodemailer');
var router = express.Router();
var User = require('../Schemas/UserSchema').User;
var Game = require('../Schemas/GameSchema').Game;
var Score = require('../Schemas/ScoreSchema').Score;

/* Get game with requested ID. */
router.post('/listgames', function(req, res, next)  {
    if (req.session.username === null || req.session.username === undefined)
    {
        res.send({status: "ERROR"});
    }
    else
    {
        Game.find({player: req.session.username}, function (err, foundGames) {
            if (err){
                res.send({status: "ERROR"});
            }
            else
            {
                var gamelist = [];
                foundGames.forEach(function(game){
                    var gameJSON = {id: game.id, start_date: game.start_date};
                    gamelist.push(gameJSON);
                });
                res.send({status: "OK", games: gamelist});
            }
        });
    }
});

/* Get game with requested ID. */
router.post('/getgame', function(req, res, next)  {
    var gameID = req.body.id;
    Game.findOne({id: gameID}, function (err, foundGame) {
        if (err || !foundGame){
            res.send({status: "ERROR"});
        }
        else
        {
            var grid = foundGame.grid;
            var winner = foundGame.winner;
            res.send({status: "OK", grid: grid, winner: winner});
        }
    });
});

/* Get user's score post request. */
router.post('/getscore', function(req, res, next)  {
    if (req.session.username === null || req.session.username === undefined)
    {
        res.send({status: "ERROR"});
    }
    else
    {
        Score.findOne({username: req.session.username}, function (err, foundScore) {
            if (err || !foundScore){
                res.send({status: "ERROR"});
            }
            else
            {
                var humanScore = foundScore.human;
                var woprScore = foundScore.wopr;
                var tieScore = foundScore.tie;
                res.send({status: "OK", human: humanScore, wopr: woprScore, tie: tieScore});
            }
        });
    }
});

module.exports = router;
