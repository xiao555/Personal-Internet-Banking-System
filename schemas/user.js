var mongoose = require('mongoose');

var UserSchema = new mongoose.Schema({
  cardID: String,
  name: String,
  password: String,
  id: String,
  trueName: String,
})

UserSchema.statics = {
  fetch: function(cb) {
    return this
      .find({})
      .exec(cb)
  },
  findOne: function(val, cb) {
    console.log("find One");
    this.find({"name": val},function(err, doc) {
      if(err) return cb(err);
      if(doc) {
        return cd(null, doc);
      }
    })
  }
}
