var mongoose = require('mongoose')
var db = mongoose.createConnection('localhost','121bank');
db.on('error', function(err) {
  console.error(err);
});

var CardSchema = require('../schemas/card')
var Card = db.model('Card',CardSchema)
// Card.remove({}, function(err) {
//   if(err) throw err;
//   else {
//     console.log("delete success");
//   }
// });
Card.fetch(function(err, cards) {
  if (cards == 0) {
    console.log(err);
  } else {
    console.log("cards:");
    console.log(cards);
  }
})

module.exports = Card
