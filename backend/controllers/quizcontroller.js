const Attempt = require('../models/attempt');
const Question = require('../models/question');
const Quiz = require('../models/quiz');

const sanitizeQuestion = (question) => ({
  _id: question._id,
  question: question.question,
  type: question.type,
  options: question.options,
});

const createQuiz = async (req, res) => {
  try {
    const {
      title,
      description,
      questions,
      timeLimit,
      startTime,
      endTime,
      isPublished,
      testType = 'mcq',
      domain = 'General',
      subdomain = 'General',
      customDomain = '',
    } = req.body;

    if (!title || !Array.isArray(questions) || questions.length === 0 || !timeLimit || !startTime || !endTime) {
      return res.status(400).json({ message: 'Title, questions, time limit, start time, and end time are required.' });
    }

    const ownedQuestionCount = await Question.countDocuments({
      _id: { $in: questions },
      createdBy: req.user._id,
    });

    if (ownedQuestionCount !== questions.length) {
      return res.status(400).json({ message: 'Quiz can only use questions from your question bank.' });
    }

    const quiz = await Quiz.create({
      title,
      description,
      questions,
      timeLimit,
      startTime,
      endTime,
      testType,
      domain: customDomain || domain,
      subdomain,
      customDomain,
      isPublished: Boolean(isPublished),
      createdBy: req.user._id,
    });

    return res.status(201).json(await quiz.populate('questions'));
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const getInstructorQuizzes = async (req, res) => {
  try {
    const quizzes = await Quiz.find({ createdBy: req.user._id })
      .populate('questions')
      .sort({ createdAt: -1 });

    return res.json(quizzes);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const getPublishedQuizzes = async (req, res) => {
  try {
    const now = new Date();
    const { domain, subdomain } = req.query;
    const attemptedQuizIds = await Attempt.find({ student: req.user._id }).distinct('quiz');
    const filters = {
      isPublished: true,
      endTime: { $gte: now },
      _id: { $nin: attemptedQuizIds },
    };

    if (domain) filters.domain = domain;
    if (subdomain) filters.subdomain = subdomain;

    const quizzes = await Quiz.find(filters)
      .select('-questions.correctAnswer')
      .sort({ startTime: 1 });

    return res.json(quizzes);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const getQuizForAttempt = async (req, res) => {
  try {
    const now = new Date();
    const quiz = await Quiz.findById(req.params.id).populate('questions');

    if (!quiz || !quiz.isPublished) {
      return res.status(404).json({ message: 'Quiz not found.' });
    }

    if (now < quiz.startTime || now > quiz.endTime) {
      return res.status(403).json({ message: 'Quiz is outside the allowed attempt window.' });
    }

    const existingAttempt = await Attempt.findOne({ quiz: quiz._id, student: req.user._id });
    if (existingAttempt) {
      return res.status(409).json({ message: 'You have already attempted this quiz.' });
    }

    return res.json({
      _id: quiz._id,
      title: quiz.title,
      description: quiz.description,
      timeLimit: quiz.timeLimit,
      startTime: quiz.startTime,
      endTime: quiz.endTime,
      testType: quiz.testType,
      domain: quiz.domain,
      subdomain: quiz.subdomain,
      questions: quiz.questions.map(sanitizeQuestion),
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const updateQuiz = async (req, res) => {
  try {
    const quiz = await Quiz.findOne({ _id: req.params.id, createdBy: req.user._id });

    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found.' });
    }

    const { title, description, questions, timeLimit, startTime, endTime, isPublished, testType, domain, subdomain, customDomain } = req.body;

    if (questions) {
      const ownedQuestionCount = await Question.countDocuments({
        _id: { $in: questions },
        createdBy: req.user._id,
      });

      if (ownedQuestionCount !== questions.length) {
        return res.status(400).json({ message: 'Quiz can only use your questions.' });
      }
      quiz.questions = questions;
    }

    quiz.title = title || quiz.title;
    quiz.description = description ?? quiz.description;
    quiz.timeLimit = timeLimit || quiz.timeLimit;
    quiz.startTime = startTime || quiz.startTime;
    quiz.endTime = endTime || quiz.endTime;
    quiz.testType = testType || quiz.testType;
    quiz.domain = customDomain || domain || quiz.domain;
    quiz.subdomain = subdomain || quiz.subdomain;
    quiz.customDomain = customDomain ?? quiz.customDomain;
    quiz.isPublished = typeof isPublished === 'boolean' ? isPublished : quiz.isPublished;

    return res.json(await quiz.save());
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const getQuizAnalytics = async (req, res) => {
  try {
    const quiz = await Quiz.findOne({ _id: req.params.id, createdBy: req.user._id }).populate('questions');

    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found.' });
    }

    const attempts = await Attempt.find({ quiz: quiz._id })
      .populate('student', 'name email')
      .populate('answers.question', 'question');

    const averageScore = attempts.length
      ? attempts.reduce((sum, attempt) => sum + attempt.score, 0) / attempts.length
      : 0;

    const questionStats = quiz.questions.map((question) => {
      const correctCount = attempts.filter((attempt) =>
        attempt.answers.some((answer) => String(answer.question._id) === String(question._id) && answer.isCorrect)
      ).length;

      return {
        questionId: question._id,
        question: question.question,
        correctCount,
        incorrectCount: attempts.length - correctCount,
        accuracy: attempts.length ? Math.round((correctCount / attempts.length) * 100) : 0,
      };
    });

    return res.json({
      quiz: {
        _id: quiz._id,
        title: quiz.title,
        totalQuestions: quiz.questions.length,
        testType: quiz.testType,
        domain: quiz.domain,
        subdomain: quiz.subdomain,
      },
      totalAttempts: attempts.length,
      averageScore: Number(averageScore.toFixed(2)),
      highestScore: attempts.length ? Math.max(...attempts.map((attempt) => attempt.score)) : 0,
      attempts,
      questionStats,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const getQuizDomains = async (req, res) => {
  try {
    const domains = await Quiz.aggregate([
      { $match: { isPublished: true } },
      {
        $group: {
          _id: { domain: '$domain', subdomain: '$subdomain' },
          quizCount: { $sum: 1 },
        },
      },
      { $sort: { '_id.domain': 1, '_id.subdomain': 1 } },
    ]);

    return res.json(domains.map((item) => ({
      domain: item._id.domain || 'General',
      subdomain: item._id.subdomain || 'General',
      quizCount: item.quizCount,
    })));
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createQuiz,
  getQuizDomains,
  getInstructorQuizzes,
  getPublishedQuizzes,
  getQuizForAttempt,
  updateQuiz,
  getQuizAnalytics,
};
