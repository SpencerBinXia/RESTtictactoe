var express = require('express');
var mongoose = require('mongoose');
var nodeMailer = require('nodemailer');
var router = express.Router();
var User = require('../Schemas/UserSchema').User;
var Score = require('../Schemas/ScoreSchema').Score;


//nodemailer Object for email verification
var smtpTransport = nodeMailer.createTransport({
    service: "gmail",
    secure: true,
    auth : {
    }
});

//Random key generation algorithm
function genKey()
{
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for( var i=0; i < 13; i++ )
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
}

//Endpoint for user registration
router.post('/adduser', function(req,res,next){
    console.log("lol");
    var status;
    var regInfo = req.body;
    console.log(regInfo.username);
    console.log(regInfo.password);
    console.log(regInfo.email);
    var regKey = genKey();
    var userDoc = new User({username: regInfo.username, password: regInfo.password, email: regInfo.email, active: false, key: regKey, gamesPlayed: 0});
    userDoc.save(function (err){
        if (err) {
            console.log("save user fail");
            res.send({status: "ERROR"});
        }
        var ScoreDoc = new Score({username: regInfo.username, human: 0, wopr: 0, tie: 0});
        ScoreDoc.save(function (err) {
            if (err) {
                console.log("update error");
                res.send({status: "ERROR"});
            }
        });
    });

    var mailOptions = {
        to: regInfo.email,
        subject: "REST TicTac - Verify Your Email",
        html: 'Your key for REST Tictactoe:' + regKey + '<br><a href="130.245.170.232/verify">Click here</a> to verify.'
    };

    smtpTransport.sendMail(mailOptions, function(error, response){
        if (error){
            console.log(error);
            status = {'status': "ERROR"};
            res.send(status);
        }
        else{
            console.log("Email success");
            //res.redirect('back');
            status = {'status': "OK"};
            console.log(status);
            res.status(200).send(status);
        }
    });
});

/* LOGIN post request. */
router.post('/login', function(req, res, next)  {
    var logInfo = req.body;
    var session = req.session;
    var logQuery = {
        $and: [
            {username: logInfo.username},
            {password: logInfo.password},
            {active: true}
        ]
    };
    var loginQuery = User.findOne(logQuery, function (err, foundUser) {
        if (err || !foundUser){
            res.send({status: "ERROR"});
        }
        else
        {
            session.username = logInfo.username;
            var today = new Date().toLocaleString();
            session.date = today;
            res.send({status: "OK"});
        }
    });
});

/* LOGOUT post request. */
router.post('/logout', function(req, res, next)  {
    req.session.username = null;
    req.session.date = null;
    req.session.grid = undefined;
    res.send({status: "OK"});
});

/* GET verify page. */
router.get('/verify', function(req, res, next)  {
    res.render('verify');
});

/* POST verify page */
router.post('/verify', function(req, res, next) {
    var verifyInfo = req.body;
    if (verifyInfo.key === "abracadabra")
    {
        var verQuery = {email: verifyInfo.email};
        User.findOneAndUpdate(verQuery, {active: true}, function (err, result) {
            if (err || !result){
                res.send({status: "ERROR"});
            }
            else
            {
                res.status(200).send({status: "OK"});
            }
        });
    }
    else
        {
        var verQuery = {
            $and: [
                {email: verifyInfo.email},
                {key: verifyInfo.key}
            ]
        };
        console.log(verifyInfo.username);
        User.findOneAndUpdate(verQuery, {active: true}, function (err, result) {
            if (err || !result) {
                res.send({status: "ERROR"});
            }
            else
            {
                res.status(200).send({status: "OK"});
            }
        });
    }
});


module.exports = router;
