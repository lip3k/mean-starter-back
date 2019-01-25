var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var FlashcardSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  score: {
    type: Number,
    required: true
  },
  reviewTimestamp: {
    type: Number,
    required: true
  },
  user: {
    type: String,
    required: true
  }
});

module.exports = mongoose.model('Flashcard', FlashcardSchema);
