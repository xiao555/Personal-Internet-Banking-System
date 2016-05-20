var mongoose = require('mongoose')
var db = mongoose.createConnection('localhost','121bank');
db.on('error', function(err) {
  console.error(err);
});

var UserSchema = require('../schemas/user')
var User = db.model('User',UserSchema)

module.exports = User
