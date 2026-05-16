const mongoose = require('mongoose');

const answerSchema = new mongoose.Schema(
  {
    question: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Question',
      required: true,
    },
    selectedAnswer: {
      type: String,
      default: '',
    },
    selectedAnswers: {
      type: [String],
      default: [],
    },
    writtenAnswer: {
      type: String,
      default: '',
    },
    correctAnswer: {
      type: String,
      default: '',
    },
    correctAnswers: {
      type: [String],
      default: [],
    },
    isCorrect: {
      type: Boolean,
      default: false,
    },
    needsReview: {
      type: Boolean,
      default: false,
    },
  },
  { _id: false }
);

const attemptSchema = new mongoose.Schema(
  {
    quiz: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Quiz',
      required: true,
    },
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    answers: [answerSchema],
    score: {
      type: Number,
      required: true,
    },
    totalQuestions: {
      type: Number,
      required: true,
    },
    submittedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

attemptSchema.index({ quiz: 1, student: 1 }, { unique: true });

module.exports = mongoose.model('Attempt', attemptSchema);
