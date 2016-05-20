var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  var _name = req.query.name,
      _password = req.query.password,
      _captcha = req.query.captcha;
  console.log(_name + " " + _password + " " +_captcha);
  res.render(__dirname+'/users');
});

module.exports = router;
