var mongoose = require('mongoose');

var UserSchema = new mongoose.Schema({
  cardID: Array,
  name: String,
  password: String,
  id: String,
  trueName: String,
  headUrl: String,
  regDate: String
})

UserSchema.statics = {
  fetch: function(cb) {
    return this
      .find({})
      .exec(cb)
  },
  findOne: function(val, cb) {
    this.find({"name": val},function(err, doc) {
      if(err) return cb(err);
      if(doc) {
        cb(null, doc[0]);
      }
    })
  },
  findByTrueName: function(val,cb) {
    this.find({"trueName": val}, function(err, doc) {
      if(err) return cd(err);
      else {
        cb(null, doc[0]);
      }
    })
  }
}

module.exports = UserSchema
