const mongoose = require('mongoose');

const quizSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      default: '',
      trim: true,
    },
    questions: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Question',
        required: true,
      },
    ],
    testType: {
      type: String,
      enum: ['mcq', 'multiple_answer', 'assessment', 'written'],
      default: 'mcq',
    },
    domain: {
      type: String,
      default: 'General',
      trim: true,
    },
    subdomain: {
      type: String,
      default: 'General',
      trim: true,
    },
    customDomain: {
      type: String,
      default: '',
      trim: true,
    },
    timeLimit: {
      type: Number,
      required: true,
      min: 1,
    },
    startTime: {
      type: Date,
      required: true,
    },
    endTime: {
      type: Date,
      required: true,
    },
    isPublished: {
      type: Boolean,
      default: false,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Quiz', quizSchema);
