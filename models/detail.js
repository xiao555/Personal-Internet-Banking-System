var mongoose = require('mongoose')
var db = mongoose.createConnection('localhost','121bank');
db.on('error', function(err) {
  console.error(err);
});

var DetailSchema = require('../schemas/detail')
var Detail = db.model('Detail',DetailSchema)
// Detail.remove({}, function(err) {
//   if(err) throw err;
//   else {
//     console.log("delete success");
//   }
// });
// Detail.fetch(function(err, details) {
//   if (details == 0) {
//     console.log(err);
//   } else {
//     console.log("details:");
//     console.log(details);
//   }
// })

module.exports = Detail
