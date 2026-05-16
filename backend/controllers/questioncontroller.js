const Question = require('../models/question');

const createQuestion = async (req, res) => {
  try {
    const { question, type = 'mcq', options = [], correctAnswer = '', correctAnswers = [] } = req.body;
    const objectiveTypes = ['mcq', 'multiple_answer'];
    const cleanOptions = options.filter(Boolean);
    const cleanCorrectAnswers = type === 'multiple_answer' ? correctAnswers.filter(Boolean) : [];

    if (!question) {
      return res.status(400).json({ message: 'Question text is required.' });
    }

    if (objectiveTypes.includes(type) && cleanOptions.length !== 4) {
      return res.status(400).json({ message: 'MCQ and multiple-answer questions need exactly four options.' });
    }

    if (type === 'mcq' && (!correctAnswer || !cleanOptions.includes(correctAnswer))) {
      return res.status(400).json({ message: 'Correct answer must match one of the four options.' });
    }

    if (type === 'multiple_answer' && (cleanCorrectAnswers.length === 0 || cleanCorrectAnswers.some((answer) => !cleanOptions.includes(answer)))) {
      return res.status(400).json({ message: 'Multiple-answer correct answers must be selected from the four options.' });
    }

    const createdQuestion = await Question.create({
      question,
      type,
      options: objectiveTypes.includes(type) ? cleanOptions : [],
      correctAnswer: type === 'mcq' ? correctAnswer : '',
      correctAnswers: cleanCorrectAnswers,
      createdBy: req.user._id,
    });

    return res.status(201).json(createdQuestion);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const getQuestions = async (req, res) => {
  try {
    const questions = await Question.find({ createdBy: req.user._id }).sort({ createdAt: -1 });
    return res.json(questions);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const updateQuestion = async (req, res) => {
  try {
    const question = await Question.findOne({ _id: req.params.id, createdBy: req.user._id });

    if (!question) {
      return res.status(404).json({ message: 'Question not found.' });
    }

    const nextType = req.body.type || question.type;
    const nextOptions = req.body.options || question.options;
    const nextCorrectAnswer = req.body.correctAnswer ?? question.correctAnswer;
    const nextCorrectAnswers = req.body.correctAnswers || question.correctAnswers;

    if (['mcq', 'multiple_answer'].includes(nextType) && nextOptions.length !== 4) {
      return res.status(400).json({ message: 'Objective questions need four options.' });
    }

    if (nextType === 'mcq' && !nextOptions.includes(nextCorrectAnswer)) {
      return res.status(400).json({ message: 'Use four options and choose a correct answer from them.' });
    }

    question.question = req.body.question || question.question;
    question.type = nextType;
    question.options = ['mcq', 'multiple_answer'].includes(nextType) ? nextOptions : [];
    question.correctAnswer = nextType === 'mcq' ? nextCorrectAnswer : '';
    question.correctAnswers = nextType === 'multiple_answer' ? nextCorrectAnswers : [];

    return res.json(await question.save());
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const deleteQuestion = async (req, res) => {
  try {
    const question = await Question.findOneAndDelete({ _id: req.params.id, createdBy: req.user._id });

    if (!question) {
      return res.status(404).json({ message: 'Question not found.' });
    }

    return res.json({ message: 'Question deleted.' });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports = { createQuestion, getQuestions, updateQuestion, deleteQuestion };
