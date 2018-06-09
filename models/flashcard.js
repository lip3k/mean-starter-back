var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var FlashcardSchema = new Schema({
  question: {
    type: String,
    required: true
  },
  answer: {
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
