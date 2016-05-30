var mongoose = require('mongoose');

var CardSchema = new mongoose.Schema({
  cardID: String,
  balance: Number,
  name: String
})

CardSchema.statics = {
  fetch: function(cb) {
    return this
      .find({})
      .exec(cb)
  },
  findOne: function(val, cb) {
    this.find({"cardID": val},function(err, doc) {
      if(err) return cb(err);
      if(doc) {
        cb(null, doc[0]);
      }
    })
  }
}

module.exports = CardSchema
