const Attempt = require('../models/attempt');
const Quiz = require('../models/quiz');

const sameAnswers = (selectedAnswers, correctAnswers) => {
  if (selectedAnswers.length !== correctAnswers.length) return false;
  const selectedSet = new Set(selectedAnswers);
  return correctAnswers.every((answer) => selectedSet.has(answer));
};

const submitAttempt = async (req, res) => {
  try {
    const { answers = [] } = req.body;
    const quiz = await Quiz.findById(req.params.quizId).populate('questions');
    const now = new Date();

    if (!quiz || !quiz.isPublished) {
      return res.status(404).json({ message: 'Quiz not found.' });
    }

    if (now < quiz.startTime || now > quiz.endTime) {
      return res.status(403).json({ message: 'Quiz submission window is closed.' });
    }

    const existingAttempt = await Attempt.findOne({ quiz: quiz._id, student: req.user._id });
    if (existingAttempt) {
      return res.status(409).json({ message: 'You have already submitted this quiz.' });
    }

    const answerMap = new Map(answers.map((answer) => [String(answer.question), answer]));
    const gradedAnswers = quiz.questions.map((question) => {
      const submittedAnswer = answerMap.get(String(question._id)) || {};
      const selectedAnswer = submittedAnswer.selectedAnswer || '';
      const selectedAnswers = submittedAnswer.selectedAnswers || [];
      const writtenAnswer = submittedAnswer.writtenAnswer || '';
      const correctAnswers = question.type === 'multiple_answer' ? question.correctAnswers : [];
      const needsReview = ['written', 'assessment'].includes(question.type);
      const isCorrect = question.type === 'mcq'
        ? selectedAnswer === question.correctAnswer
        : question.type === 'multiple_answer'
          ? sameAnswers(selectedAnswers, correctAnswers)
          : false;

      return {
        question: question._id,
        selectedAnswer,
        selectedAnswers,
        writtenAnswer,
        correctAnswer: question.correctAnswer,
        correctAnswers,
        isCorrect,
        needsReview,
      };
    });

    const score = gradedAnswers.filter((answer) => answer.isCorrect).length;
    const attempt = await Attempt.create({
      quiz: quiz._id,
      student: req.user._id,
      answers: gradedAnswers,
      score,
      totalQuestions: quiz.questions.length,
    });

    const populatedAttempt = await Attempt.findById(attempt._id)
      .populate('quiz', 'title testType domain subdomain')
      .populate('answers.question', 'question options type');

    return res.status(201).json(populatedAttempt);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ message: 'You have already submitted this quiz.' });
    }

    return res.status(500).json({ message: error.message });
  }
};

const getMyAttempts = async (req, res) => {
  try {
    const attempts = await Attempt.find({ student: req.user._id })
      .populate('quiz', 'title testType domain subdomain')
      .populate('answers.question', 'question options type')
      .sort({ submittedAt: -1 });

    return res.json(attempts);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const getAttemptById = async (req, res) => {
  try {
    const attempt = await Attempt.findOne({ _id: req.params.id, student: req.user._id })
      .populate('quiz', 'title testType domain subdomain')
      .populate('answers.question', 'question options type');

    if (!attempt) {
      return res.status(404).json({ message: 'Result not found.' });
    }

    return res.json(attempt);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const getLeaderboard = async (req, res) => {
  try {
    const { domain, subdomain } = req.query;
    const quizFilter = {};
    if (domain) quizFilter.domain = domain;
    if (subdomain) quizFilter.subdomain = subdomain;

    const quizzes = await Quiz.find(quizFilter).select('_id');
    const quizIds = quizzes.map((quiz) => quiz._id);

    const attempts = await Attempt.find(quizIds.length ? { quiz: { $in: quizIds } } : {})
      .populate('student', 'name email')
      .populate('quiz', 'title domain subdomain')
      .sort({ score: -1, submittedAt: 1 });

    const bestByStudent = new Map();
    attempts.forEach((attempt) => {
      const percentage = attempt.totalQuestions ? Math.round((attempt.score / attempt.totalQuestions) * 100) : 0;
      const current = bestByStudent.get(String(attempt.student._id));
      if (!current || percentage > current.percentage) {
        bestByStudent.set(String(attempt.student._id), {
          student: attempt.student.name,
          quiz: attempt.quiz.title,
          domain: attempt.quiz.domain,
          subdomain: attempt.quiz.subdomain,
          score: attempt.score,
          totalQuestions: attempt.totalQuestions,
          percentage,
          submittedAt: attempt.submittedAt,
        });
      }
    });

    return res.json([...bestByStudent.values()].sort((a, b) => b.percentage - a.percentage).slice(0, 10));
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports = { submitAttempt, getMyAttempts, getAttemptById, getLeaderboard };
