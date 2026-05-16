const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema(
  {
    question: {
      type: String,
      required: true,
      trim: true,
    },
    type: {
      type: String,
      enum: ['mcq', 'multiple_answer', 'written', 'assessment'],
      default: 'mcq',
    },
    options: {
      type: [String],
      default: [],
    },
    correctAnswer: {
      type: String,
      default: '',
      trim: true,
    },
    correctAnswers: {
      type: [String],
      default: [],
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Question', questionSchema);
