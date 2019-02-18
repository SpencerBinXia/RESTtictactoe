var express = require('express');
var router = express.Router();

var tttGame = require('../controllers/tttGame');

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
   // console.log(req.body);
    var board = req.body;

    //console.debug(board);
    var winCell = tttGame.winner(board.grid);
    //console.log(winCell);
    if (winCell === "X" || winCell === "O")
    {
        board["winner"] = winCell;
        res.send(board);
    }
    else
    {
        var newboard = tttGame.play(board.grid);
        winCell = tttGame.winner(board.grid);
        board["grid"] = newboard;
        board["winner"] = winCell;
        res.send(board);
    }
    //var newgrid = JSON.stringify({grid: board, winner: winCell});
    //console.log(newgrid);;
});

module.exports = router;
