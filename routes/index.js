var express = require('express');
var captchapng = require('captchapng');
var router = express.Router();
var User = require('../models/user');
var Card = require('../models/card');
var Detail = require('../models/detail');
var Log = require('../models/log');
var formidable = require('formidable');
var uuid = require('node-uuid');
var fs = require('fs');
var moment = require('../public/js/moment');


  var usersList = [],//用户
      idList = [],//身份证号
      cardList = [];//银行卡号
  User.fetch(function(err,doc) {
    console.log(doc);
    for(var i=0;i< doc.length;i++) {
      console.log(doc[i]);
      usersList.push(doc[i].name);
      idList.push(doc[i].id);
    }
  })
  Card.fetch(function(err,doc) {
    for(var i=0;i<doc.length;i++) {
      cardList.push(doc[i].cardID);
    }
  })


/* GET home page. */
router.get('/', function(req, res, next) {
  console.log(usersList);
  console.log(idList);
  console.log(cardList);
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
    password: "",
    trueName: ""
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
      user.trueName = doc.trueName;
      console.log(_password);
      console.log(user);
      if(_name == user.name&&_password == user.password) {
        console.log(_captcha + " " + req.session.checkcode);
        if(_captcha == req.session.checkcode){
          req.session.user = user;
          var log = new Log;
          log.date = moment().format('lll');
          log.name = user.name;
          log.trueName = user.trueName;
          log.method = "登录";
          log.save(function(err) {
            if(err) throw err;
            else {
              res.json({success: '登陆成功'});
              console.log("登陆成功");
            }
          })
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
  var log = new Log;
  log.date = moment().format('lll');
  log.name = req.session.user.name;
  log.trueName = req.session.user.trueName;
  log.method = "登出";
  log.save(function(err) {
    if(err) throw err;
    else {
      console.log(req.session.user);
      req.session.user = null;
      console.log(req.session.user);
      res.send(200);
    }
  })
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
        Card.findByName(req.session.user.trueName, function(err, cards) {
          if(err) throw(err);
          else {
            res.render('user',{
              user: doc,
              cards: cards,
              message: message
            });
          }
        })
      } else {
        console.log(req.session.user);
        Card.findByName(req.session.user.trueName, function(err, cards) {
          if(err) throw(err);
          else {
            console.log(cards);
            res.render('user',{
              user: doc,
              cards: cards,
              message: ""
            });
          }
        })
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
      _regDate = moment().format('lll'); //01/01/2016
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
    req.session.error = error;
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
          card.trueName = _trueName;
          card.balance = 10000;
          card.save(function(err) {
            if (err) throw err;
            else {
              var log = new Log;
              log.date = moment().format('lll');
              log.name = _name;
              log.trueName = _trueName;
              log.method = "注册";
              log.save(function(err) {
                if(err) throw err;
                else {
                  console.log("注册成功");
        					req.session.success = "注册成功";
        					return res.redirect('/');
                }
              })
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
  var _name = req.body.name,
      _id = req.body.id,
      _trueName = req.body.trueName,
      _captcha = req.body.captcha;
  if(_captcha == req.session.modcheckcode) {
    User.findOne(req.session.user.name, function(err,user) {
      if (err) {
        console.log(err);
        res.send('error');
      } else {
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
            card.trueName = req.session.user.trueName;
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
        Card.remove({trueName: req.session.user.trueName},function(err, docs) {
          if(err) {
            console.log(err);
            res.json({error: 0});
          } else {
            Detail.remove({trueName: req.session.user.trueName},function(err, docs) {
              if(err) throw err;
              else {
                console.log("删除成功");
                req.session.success = "删除成功";
          			res.json({success: 0});
              }
            })// Detail remove
          }
        })//card remove
			}
		})
})

//转账
router.post('/transfer', function(req, res, next) {
  console.log(req.body);
  var _fromID = req.body.fromID,
      _transNum = req.body.transNum,
      _toID = req.body.toID,
      _toName = req.body.toName;
  console.log(_toName);
  Card.findOne(_fromID, function(err, fromcard) {
    if(err) throw error;
    else {
      console.log(fromcard);
      Card.findOne(_toID, function(err, tocard) {
        if(err) throw error;
        else {
          console.log(tocard);
          if(tocard.trueName != _toName) {
            console.log(tocard.trueName);
            console.log("户名与卡号不对应");
            res.json({
              error: "户名与卡号不对应"
            })
          } else {
            if(fromcard.balance < parseInt(_transNum)) {
              return res.send(404,{
                error: "余额不足",
              });
            }
            fromcard.balance = fromcard.balance-parseInt(_transNum);
            tocard.balance = tocard.balance+parseInt(_transNum);
            console.log(fromcard.balance);
            console.log(tocard.balance);
            fromcard.save(function(err) {
              if(err) throw err;
              else {
                tocard.save(function(err) {
                  if(err) throw err;
                  else {
                    var detail1 = new Detail;
                    detail1.trueName = req.session.user.trueName;
                    detail1.cardID = _fromID;
                    detail1.date = moment().format('lll');//01/01/2016
                    detail1.method = "转账";
                    detail1.out = parseInt(_transNum);
                    detail1.in = 0;
                    detail1.opCard = _toID;
                    detail1.opName = _toName;
                    detail1.balance = fromcard.balance;
                    var detail2 = new Detail;
                    detail2.trueName = req.session.user.trueName;
                    detail2.cardID = _toID;
                    detail2.date = moment().format('lll');//01/01/2016
                    detail2.method = "转账";
                    detail2.out = 0;
                    detail2.in = parseInt(_transNum);
                    detail2.opCard = _fromID;
                    detail2.opName = fromcard.trueName;
                    detail2.balance = tocard.balance;
                    detail1.save(function(err) {
                      if(err) throw err;
                      else {
                        detail2.save(function(err) {
                          if(err) throw err;
                          else {
                            res.json({
                              success: 0
                            })
                          }
                        })//save detail2
                      }
                    })//save detail1
                  }
                })//save tocard
              }
            })//save fromcard
          }
        }
      })//find tocardID
    }
  })//find fromID
})

router.post('/phoneRecharge', function(req, res, next) {
  var cardID = req.body.cardID,
      phone = req.body.phone,
      money = req.body.money;
  Card.findOne(cardID, function(err, card) {
    if(err) throw err;
    else {
      if(card.balance < parseInt(money)) {
        return res.send(404,{
          error: "余额不足",
        });
      }
      card.balance -= parseInt(money);
      card.save(function(err) {
        if(err) throw err;
        else {
          var detail = new Detail;
          detail.trueName = req.session.user.trueName;
          detail.cardID = cardID;
          detail.date = moment().format('lll');
          detail.method = "手机充值";
          detail.out = parseInt(money);
          detail.in = 0;
          detail.opCard = "";
          detail.opName = "";
          detail.balance = card.balance;
          detail.save(function(err) {
            if(err) throw err;
            else {
              console.log(detail);
              res.json({
                success: 0
              })
            }
          })//save detail
        }
      })//save card
    }
  })//findOne card
})

router.post('/getDetail', function(req, res, next) {
  var _cardID = req.body.cardID;
  console.log(_cardID);
  Detail.findById(_cardID, function(err, details) {
    if(err) throw err;
    else {
      console.log(details);
      res.json({
        details: details
      })
    }
  })// findById
})

router.get('/log', function(req, res, next) {
  if(req.session.user.name == "xiao555") {
    Log.fetch(function(err, docs) {
      if(err) throw err;
      else {
        console.log(docs);
        res.render('log',{
          docs: docs
        })
      }
    })
  } else {
    res.direct('index', {
      message: "你不是老司机",
    })
  }
})

router.post('/getUserMsg', function(req, res, next) {
  var _name = req.body.quename;
  console.log(_name);
  User.findOne(_name, function(err, doc) {
    if(err) throw err;
    else {
      console.log(doc);
      res.json({
        msg: doc,
      })
    }
  })
})


module.exports = router;
