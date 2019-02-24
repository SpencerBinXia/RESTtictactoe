var express = require('express');
var mongoose = require('mongoose');
var nodeMailer = require('nodemailer');
var router = express.Router();

//Mongoose User Schema
var Schema = mongoose.Schema;

var UserSchema = new Schema({
    username: {type: String, unique: true},
    password: String,
    email: String,
    active: Boolean,
    key: String
});

var User = mongoose.model('User', UserSchema);

//nodemailer Object for email verification
var smtpTransport = nodeMailer.createTransport({
    service: "gmail",
    secure: true,
    auth : {
        user: "356sxiatictac@gmail.com",
        pass: "thisis356!"
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

// Endpoint for user registration
router.post('/adduser', function(req,res,next){
    console.log("lol");
    var regInfo = req.body;
    console.log(regInfo.username);
    console.log(regInfo.password);
    console.log(regInfo.email);
    var regKey = genKey();
    var userDoc = new User({username: regInfo.username, password: regInfo.password, email: regInfo.email, active: false, key: regKey});
    userDoc.save(function (err){
        console.log("verify mongoose error");
    });

    var mailOptions = {
        to: regInfo.email,
        subject: "REST TicTac - Verify Your Email",
        html: 'Your key for REST Tictactoe:' + regKey + '<br><a href="130.245.170.232/verify">Click here</a> to verify.'
    };

    smtpTransport.sendMail(mailOptions, function(error, response){
        if (error){
            console.log(error);
            res.end("error");
        }
        else{
            console.log("Email success");
            res.redirect('back');
        }
    });
});

/* GET verify page. */
router.get('/verify', function(req, res, next)  {
    res.render('verify');
});

/* POST verify page */
router.post('/verify', function(req, res, next) {
    var verifyInfo = req.body;
    var verQuery = {$and:[
        {username: verifyInfo.username},
        {key: verifyInfo.key}
        ]};
    console.log(verifyInfo.username);
    User.findOneAndUpdate(verQuery, {active: true}, function (err, person) {
        if (err) return handleError(err);
        // Prints "Space Ghost is a talk show host".
    });
    res.redirect('/ttt');
});



module.exports = router;
