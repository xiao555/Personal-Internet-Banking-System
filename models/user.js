var mongoose = require('mongoose')
var db = mongoose.createConnection('localhost','121bank');
db.on('error', function(err) {
  console.error(err);
});

var UserSchema = require('../schemas/user')
var User = db.model('User',UserSchema)
User.fetch(function(err, users) {
  if (users == 0) {
    console.log(err);
  } else {
    console.log("users:");
    console.log(users);
  }
})

module.exports = User
