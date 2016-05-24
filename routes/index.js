var express = require('express');
var captchapng = require('captchapng');
var router = express.Router();
var User = require('../models/user');
var formidable = require('formidable');

/* GET home page. */
router.get('/', function(req, res, next) {
  if(req.session.success) {
    var success = req.session.success;
    req.session.success = "";
    console.log("success message");
    res.render('index', {
      message: success
    })
  } else if(req.session.error) {
    var error = req.session.error;
    req.session.error = "";
    console.log("error message");
    res.render('index', {
      message: error
   });
 } else {
   console.log("no message");
   res.render('index', {
     message: "",
   });
 }
});

// 处理登录事件
router.post('/', function(req, res, next) {
  var user = {
    name: "",
    password: ""
  };
  var _name = req.body.name,
      _password = req.body.password,
      _captcha = req.body.captcha;
  console.log(_name + " " + _password　+ " " + _captcha);
  User.findOne(_name, function(err, doc) {
    if(doc == '' ) {
      console.log("user not find");
      req.session.error = "该用户未注册";
      console.log("ok");
      res.send(404);
    } else {
      console.log("find");
      console.log(doc);
      user.name = doc.name;
      user.password = doc.password;
      console.log(_password);
      console.log(user);
      if(_name == user.name&&_password == user.password) {
        console.log(_captcha + " " + req.session.checkcode);
        if(_captcha == req.session.checkcode){
          req.session.user = user;
          res.send(200);
        } else {
          req.session.error = "验证码错误";
          res.send(404);
        }
      } else {
        req.session.error = "密码不正确";
        res.send(404);
      }
    }
  });
})

// 获取登录验证码
router.get('/captcha.png',function(req, res, next) {
	var code = parseInt(Math.random()*9000+1000);
    req.session.checkcode = code;

	var p = new captchapng(80,30,code); // width,height,numeric captcha
		console.log(code);
        p.color(255, 255, 255, 0);  // First color: background (red, green, blue, alpha)
        p.color(80, 80, 80, 255); // Second color: paint (red, green, blue, alpha)

        var img = p.getBase64();
        var imgbase64 = new Buffer(img,'base64');
        res.writeHead(200, {
            'Content-Type': 'image/png'
        });
        res.end(imgbase64);
})
// 获取注册验证码
router.get('/reg-captcha.png',function(req, res, next) {
	var code = parseInt(Math.random()*9000+1000);
    req.session.regcheckcode = code;

	var p = new captchapng(80,30,code); // width,height,numeric captcha
		console.log(code);
        p.color(255, 255, 255, 0);  // First color: background (red, green, blue, alpha)
        p.color(80, 80, 80, 255); // Second color: paint (red, green, blue, alpha)

        var img = p.getBase64();
        var imgbase64 = new Buffer(img,'base64');
        res.writeHead(200, {
            'Content-Type': 'image/png'
        });
        res.end(imgbase64);
})
// 用户页
router.get('/user', function(req, res, next) {
  User.findOne(req.session.user.name, function(err,doc) {
    if (doc == 0) {
      req.session.error = "该用户未注册";
      res.redirect('/');
    } else {
      res.render('user',{user: doc});
    }
  })
})

router.get('/register', function(req, res, next) {
  if(req.session.error) {
    var error = req.session.error;
    req.session.error = "";
    res.render('register', {
      error: error
   });
 } else {
   res.render('register', {
     error: "",
   });
 }
})

router.post('/register', function(req, res, next) {
  var _cardID = req.body.cardID,
      _name = req.body.name,
      _password = req.body.password,
      _id = req.body.id,
      _trueName = req.body.trueName,
      _captcha = req.body.captcha;
  if(_captcha == req.session.regcheckcode) {
    var user = new User;
    user.cardID = _cardID;
    user.name = _name;
    user.password = _password;
    user.id = _id;
    user.trueName = _trueName;
    user.save(function(err) {
				if (err) throw err;
				else {
          console.log("注册成功");
					req.session.success = "注册成功";
					return res.redirect('/');
				}
				});
  } else {
    req.session.error = "验证码错误";
    res.send(404);
  }
})


module.exports = router;
