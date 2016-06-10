var mongoose = require('mongoose');

var LogSchema = new mongoose.Schema({
  date: String,
  name: String,
  trueName: String,
  method: String,
})

LogSchema.statics = {
  fetch: function(cb) {
    return this
      .find({})
      .exec(cb)
  },
  findByName: function(val, cb) {
    this.find({"name": val},function(err, docs) {
      if(err) return cb(err);
      if(docs) {
        cb(null, docs);
      }
    })
  },
}

module.exports = LogSchema
