var mongoose = require('mongoose');

var DetailSchema = new mongoose.Schema({
  cardID: String,
  date: String,
  method: String,
  out: Number,
  in: Number,
  opCard: String,
  opName: String,
  balance: Number
})

DetailSchema.statics = {
  fetch: function(cb) {
    return this
      .find({})
      .exec(cb)
  },
  findById: function(val, cb) {
    this.find({"cardID": val},function(err, docs) {
      if(err) return cb(err);
      if(docs) {
        cb(null, docs);
      }
    })
  },
}

module.exports = DetailSchema
