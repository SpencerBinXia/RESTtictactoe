var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/ttt', function(req, res, next)  {
  res.render('index', { title: 'Tic Tac Toe'});
});

/* POST home page once name is entered. */
router.post('/ttt', function(req, res, next) {
    var name = req.body.name;
    var today = new Date().toLocaleString();
    res.render('index', { title: 'Tic Tac Toe', name: name, date: today});
});

/* API endpoint for TicTacToe JSON */
router.post('/play', function(req,res, next) {
    console.log(req.body);
    var newgrid = req.body;
    //var ai = require("/controllers/tttAI.js");
    res.send(newgrid);
});

module.exports = router;
