var express = require('express');
var captchapng = require('captchapng');
var router = express.Router();
var User = require('../models/user');
var Card = require('../models/card');
var formidable = require('formidable');
var uuid = require('node-uuid');
var fs = require('fs');
var moment = require('../public/js/moment');

var usersList = [],//用户
    idList = [],//身份证号
    cardList = [];//银行卡号
User.fetch(function(doc) {
  for (item in doc) {
    usersList.push(item.name);
    idList.push(item.id);
    for ( cardItem in item.cardID) {
      cardList.push(cardItem);
    }
  }
})
console.log("card:");
Card.fetch(function(doc) {
  for (var item in doc) {
    console.log(item.cardID);
  }
})
console.log("user:");
console.log(usersList);
console.log(idList);
console.log(cardList);


/* GET home page. */
router.get('/', function(req, res, next) {
  if(req.session.user) {
    req.session.user = "";
  }
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
    if(!doc) {
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
          res.json({success: '登陆成功'});
          console.log("登陆成功");
        } else {
          req.session.error = "验证码错误";
//          res.json({error: '验证码错误'});
          console.log("验证码错误");
          res.send(404);
        }
      } else {
        req.session.error = "密码不正确";
//        res.json({error: '密码不正确'});
        console.log("密码不正确");
        res.send(404);
      }
    }
  });
})//上面的验证返回信息有待完善

//登出
router.post('/logout', function(req, res, next) {
  console.log(req.session.user);
  req.session.user = null;
  console.log(req.session.user);
  res.send(200);
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
// 获取修改验证码
router.get('/mod-captcha.png',function(req, res, next) {
	var code = parseInt(Math.random()*9000+1000);
    req.session.modcheckcode = code;

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

//验证登录
router.post('/user', function(req, res, next) {
  console.log(req.session.user);
  if(req.session.user == null) {
    console.log("未登录");
    console.log(req.session.user);
    return res.json({error: '未登录'});
  } else {
    console.log("已登录");
    console.log(req.session.user);
    return res.json({success: '已登录'});
  }
})

// 用户页
router.get('/user', function(req, res, next) {
  if(!req.session.user) {
    console.log("请先登录");
    var message = "请先登录";
    res.render('error',{
      message: message,
      error: {}
    });
  }
  User.findOne(req.session.user.name, function(err,doc) {
    if (doc == 0) {
      req.session.error = "该用户未注册";
      res.redirect('/');
    } else {
      if(req.session.success) {
        var message = req.session.success;
        req.session.success = "";
        res.render('user',{
          user: doc,
          message: message
        });
      } else {
        res.render('user',{
          user: doc,
          message: ""
        });
      }
    }
  })
})


//注册页
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
//处理注册
router.post('/register', function(req, res, next) {
  var _cardID = req.body.cardID,
      _name = req.body.name,
      _password = req.body.password,
      _id = req.body.id,
      _trueName = req.body.trueName,
      _captcha = req.body.captcha,
      _regDate = moment().format('L'); //01/01/2016
  console.log("注册：" + _name);
  //检验是否已经存在
  var error = [];
  usersList.forEach(function(item,index,array) {
    if(item == _name)  error.push('用户名已存在');
  });

  cardList.forEach(function(item,index,array) {
    if(item == _cardID) error.push('该卡已注册');
  });

  idList.forEach(function(item, index, array) {
    if(item == _id) error.push('该身份证已注册');
  })
  console.log(error);
  if(error != 0) {
    return res.json({
      error: error
    })
  }
  console.log("验证通过");
  if(_captcha == req.session.regcheckcode) {

    var user = new User;
    user.cardID = _cardID;
    user.name = _name;
    user.password = _password;
    user.id = _id;
    user.trueName = _trueName;
    user.regDate = _regDate;
    user.balance = 10000;
    user.save(function(err) {
				if (err) throw err;
				else {
          var card = new Card;
          card.cardID = _cardID;
          card.name = _name;
          card.balance = 10000;
          card.save(function(err) {
            if (err) throw err;
            else {
              console.log("save card success!");
              console.log("注册成功");
    					req.session.success = "注册成功";
    					return res.redirect('/');
            }
          })

				}
				});
  } else {
    req.session.error = "验证码错误";
    res.send(404);
  }
})

// 上传头像
router.post('/upload', function(req, res, next) {
  //创建上传表单
	var form = new formidable.IncomingForm();
	//设置编辑
	form.encoding = 'utf-8';
	//设置上传目录
	form.uploadDir = 'public/upload/';
	form.keepExtensions = true;
  form.parse(req, function(err, fields, files) {
    if(err) {
      res.send(err);
      return;
    }
    console.log(fields);
    var extName = /\.[^\.]+/.exec(files.file.name);
		var ext = Array.isArray(extName)
      			? extName[0]
      			: '';
		//重命名，以防文件重复
		var avatarName = uuid() + ext;
    console.log(avatarName);
		//移动的文件目录
		var newPath = form.uploadDir + avatarName;
		fs.renameSync(files.file.path, newPath);
    //保存路径
    User.findOne(req.session.user.name, function(err,doc) {
      if (doc == 0) {
        res.send('error');
      } else {
        doc.headUrl = avatarName;
        doc.save(function(err) {
    				if (err) throw err;
    				else {
              console.log("上传成功");
    					req.session.success = "上传成功";
              console.log(doc);
    					res.send('success');
    				}
    		});
      }
    })//save
  })
})

router.get('/modifi', function(req, res, next) {
  User.findOne(req.session.user.name, function(err,doc) {
    if (doc == 0) {
      req.session.error = "该用户未注册";
      res.redirect('/');
    } else {
      if(req.session.error) {
        var message = req.session.error;
        req.session.error = "";
        res.render('modifi',{
          user: doc,
          message: message
        });
      } else {
        res.render('modifi',{
          user: doc,
          message: ""
        });
      }
    }
  })
})

router.post('/modifi', function(req, res, next) {
  var _cardID = req.body.cardID,
      _name = req.body.name,
      _id = req.body.id,
      _trueName = req.body.trueName,
      _captcha = req.body.captcha;
  if(_captcha == req.session.modcheckcode) {
    User.findOne(req.session.user.name, function(err,user) {
      if (err) {
        console.log(err);
        res.send('error');
      } else {
        user.cardID = _cardID;
        user.name = _name;
        user.id = _id;
        user.trueName = _trueName;
        user.save(function(err) {
    				if (err) throw err;
    				else {
              console.log("修改成功");
    					req.session.success = "修改成功";
    					return res.redirect('/');
    				}
    		});
      }
    })
  } else {
    req.session.error = "验证码错误";
    res.send(404);
  }
})

router.get('/addCard', function(req, res, next) {
  User.findOne(req.session.user.name, function(err,doc) {
    if (doc == 0) {
      req.session.error = "该用户未注册";
      res.redirect('/');
    } else {
      if(req.session.error) {
        var message = req.session.error;
        req.session.error = "";
        res.render('addCard',{
          user: doc,
          message: message
        });
      } else {
        res.render('addCard',{
          user: doc,
          message: ""
        });
      }
    }
  })
})

router.post('/addCard', function(req, res ,next) {
  var _cardID = req.body.cardID;
  console.log(_cardID);
  User.findOne(req.session.user.name, function(err,doc) {
    if (doc == 0) {
      req.session.error = "该用户未注册";
      res.redirect('/');
    } else {
      console.log(req.session.error);
      for( cardID in doc.cardID) {
        if(cardID == _cardID) req.session.error = "该卡已绑定";
      }
      Card.findOne(_cardID, function(err, doc) {
        if(doc) {
          req.session.error = "该卡已绑定"
        }
      })
      if(req.session.error) {
        res.json({
          error: req.session.error
        });
      } else {
        doc.cardID.push(_cardID);
        doc.save(function(err) {
    			if (err) throw err;
    			else {
            var card = new Card;
            card.cardID = _cardID;
            card.name = req.session.user.name;
            card.balance = 10000;
            card.save(function(err) {
              if (err) throw err;
              else {
                console.log("save card success!");
                console.log("添加成功");
      					req.session.success = "添加成功";
        				res.json({
                  success: req.session.success
                });
              }
            })
    			}
    	  });
      }
    }
  })
})

router.delete('/delUser', function(req, res, next) {
  User.remove({name: req.session.user.name},function(err, doc){
			if(err) {
				console.log(err);
				res.json({error: 0});
			} else {
        Card.remove({name: req.session.user.name},function(err, doc) {
          if(err) {
            console.log(err);
            res.json({error: 0});
          } else {
            console.log("删除成功");
            req.session.success = "删除成功";
    				res.json({success: 0});
          }
        })
			}
		})
})


module.exports = router;
