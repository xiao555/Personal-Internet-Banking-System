var express = require('express');
var captchapng = require('captchapng');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

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

module.exports = router;
