var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/ttt', function(req, res, next)  {
  res.render('index', { title: 'Tic Tac Toe'});
});

router.post('/ttt', function(req, res, next) {
    var name = req.body.name;
    var today = new Date().toLocaleString();
    console.log(req.body.name);
    console.log("anything");
    console.log(today);
    res.render('index', { title: 'Tic Tac Toe', name: name, date: today});
});

module.exports = router;
