const Question = require('../models/question');
const Quiz = require('../models/quiz');
const User = require('../models/user');

const oneYearFromNow = () => new Date(Date.now() + 365 * 24 * 60 * 60 * 1000);

const banks = [
  {
    domain: 'CSE and IT',
    subdomain: 'Cloud Computing',
    title: 'Cloud Computing Sample Quiz',
    questions: [
      ['Which service model provides servers, storage, and networking as virtual resources?', ['IaaS', 'PaaS', 'SaaS', 'FaaS'], 'IaaS'],
      ['Which cloud feature allows resources to increase or decrease based on demand?', ['Elasticity', 'Hashing', 'Indexing', 'Compilation'], 'Elasticity'],
      ['Which platform is commonly used to run containers?', ['Kubernetes', 'MongoDB', 'Photoshop', 'Excel'], 'Kubernetes'],
      ['Which storage type is best for files such as images and backups?', ['Object storage', 'CPU cache', 'RAM only', 'Browser cookies'], 'Object storage'],
      ['What is the main purpose of cloud availability zones?', ['Fault isolation', 'Code formatting', 'Password hashing', 'UI animation'], 'Fault isolation'],
    ],
  },
  {
    domain: 'CSE and IT',
    subdomain: 'Full Stack',
    title: 'Full Stack Development Sample Quiz',
    questions: [
      ['In MERN, which technology is used for the frontend UI?', ['React.js', 'MongoDB', 'Express.js', 'Node.js'], 'React.js'],
      ['Which HTTP method is commonly used to create a new resource?', ['POST', 'GET', 'TRACE', 'HEAD'], 'POST'],
      ['What does an API route usually connect?', ['Frontend and backend logic', 'Only CSS files', 'Keyboard and mouse', 'Monitor and CPU'], 'Frontend and backend logic'],
      ['Which database is used in the MERN stack?', ['MongoDB', 'MySQL only', 'SQLite only', 'Oracle Forms'], 'MongoDB'],
      ['What is JSON commonly used for?', ['Data exchange', 'Image compression', 'Video editing', 'Hardware repair'], 'Data exchange'],
    ],
  },
  {
    domain: 'CSE and IT',
    subdomain: 'Cyber Security',
    title: 'Cyber Security Sample Quiz',
    questions: [
      ['What does MFA stand for?', ['Multi-factor authentication', 'Main file access', 'Manual firewall audit', 'Memory frame allocation'], 'Multi-factor authentication'],
      ['Which attack tricks users into revealing sensitive information?', ['Phishing', 'Rendering', 'Caching', 'Linting'], 'Phishing'],
      ['What should be done with API keys?', ['Keep them secret', 'Post them publicly', 'Use them as usernames', 'Put them in screenshots'], 'Keep them secret'],
      ['Which practice improves password safety?', ['Unique strong passwords', 'Same password everywhere', 'Sharing passwords', 'Writing passwords in public chats'], 'Unique strong passwords'],
      ['What does encryption protect?', ['Data confidentiality', 'Screen brightness', 'File names only', 'Mouse speed'], 'Data confidentiality'],
    ],
  },
  {
    domain: 'CSE and IT',
    subdomain: 'Data Structures',
    title: 'Data Structures Sample Quiz',
    questions: [
      ['Which data structure follows LIFO?', ['Stack', 'Queue', 'Graph', 'Tree'], 'Stack'],
      ['Which data structure follows FIFO?', ['Queue', 'Stack', 'Heap', 'HashMap'], 'Queue'],
      ['Which structure stores key-value pairs?', ['HashMap', 'Array only', 'Queue', 'Linked list only'], 'HashMap'],
      ['Which traversal visits left, root, then right in a BST?', ['Inorder', 'Preorder', 'Postorder', 'Level order'], 'Inorder'],
      ['Which structure is useful for shortest path algorithms?', ['Graph', 'String', 'Boolean', 'CSS rule'], 'Graph'],
    ],
  },
  {
    domain: 'AI and Gen AI',
    subdomain: 'Machine Learning',
    title: 'Machine Learning Sample Quiz',
    questions: [
      ['Which task predicts a category label?', ['Classification', 'Compression', 'Rendering', 'Routing'], 'Classification'],
      ['Which task predicts a continuous number?', ['Regression', 'Tokenization only', 'Hashing', 'Styling'], 'Regression'],
      ['What is training data used for?', ['Learning model patterns', 'Changing screen color', 'Opening ports', 'Encrypting passwords'], 'Learning model patterns'],
      ['Which metric is common for classification?', ['Accuracy', 'Pixel width', 'Port count', 'File size only'], 'Accuracy'],
      ['What is overfitting?', ['Learning training data too closely', 'Not using data at all', 'Increasing monitor brightness', 'Deleting all features'], 'Learning training data too closely'],
    ],
  },
  {
    domain: 'AI and Gen AI',
    subdomain: 'Deep Learning',
    title: 'Deep Learning Sample Quiz',
    questions: [
      ['Deep learning models are mainly based on what?', ['Neural networks', 'Spreadsheets only', 'HTML tags', 'Manual sorting'], 'Neural networks'],
      ['Which layer receives raw input features?', ['Input layer', 'Footer layer', 'Route layer', 'Cache layer'], 'Input layer'],
      ['What is backpropagation used for?', ['Updating model weights', 'Drawing UI cards', 'Sending emails', 'Opening files'], 'Updating model weights'],
      ['Which hardware often speeds up deep learning?', ['GPU', 'Printer', 'Keyboard', 'Router only'], 'GPU'],
      ['Which activation function is widely used?', ['ReLU', 'HTTP', 'JSON', 'CSS'], 'ReLU'],
    ],
  },
  {
    domain: 'AI and Gen AI',
    subdomain: 'Generative AI',
    title: 'Generative AI Sample Quiz',
    questions: [
      ['What does generative AI produce?', ['New content', 'Only cables', 'Only passwords', 'Only CPU heat'], 'New content'],
      ['What is a prompt?', ['User instruction to a model', 'Database index', 'Network cable', 'Screen resolution'], 'User instruction to a model'],
      ['Which model type is commonly used for text generation?', ['Large language model', 'Firewall rule', 'Image sensor', 'File explorer'], 'Large language model'],
      ['What can improve generated answers?', ['Clear context', 'Vague wording', 'Missing instructions', 'Random symbols only'], 'Clear context'],
      ['What is hallucination in AI?', ['Incorrect generated information', 'Perfect accuracy', 'A database backup', 'A CSS animation'], 'Incorrect generated information'],
    ],
  },
  {
    domain: 'AI and Gen AI',
    subdomain: 'Prompt Engineering',
    title: 'Prompt Engineering Sample Quiz',
    questions: [
      ['What is the goal of prompt engineering?', ['Guide model output', 'Replace hardware', 'Increase screen size', 'Format disks'], 'Guide model output'],
      ['Which prompt is usually better?', ['Specific prompt', 'Ambiguous prompt', 'Empty prompt', 'Contradictory prompt'], 'Specific prompt'],
      ['Why include examples in prompts?', ['To show desired format', 'To delete context', 'To slow the model only', 'To hide requirements'], 'To show desired format'],
      ['What should constraints in a prompt do?', ['Set boundaries', 'Remove task goals', 'Break JSON', 'Change database engine'], 'Set boundaries'],
      ['What is iterative prompting?', ['Improving prompts step by step', 'Never editing prompts', 'Only using one word', 'Deleting outputs'], 'Improving prompts step by step'],
    ],
  },
  {
    domain: 'Business and Aptitude',
    subdomain: 'Logical Reasoning',
    title: 'Logical Reasoning Sample Quiz',
    questions: [
      ['If all A are B and all B are C, then all A are what?', ['C', 'Not C', 'Only A', 'Unknown always'], 'C'],
      ['Which comes next: 2, 4, 8, 16?', ['32', '18', '24', '30'], '32'],
      ['Odd one out: Apple, Mango, Carrot, Banana', ['Carrot', 'Apple', 'Mango', 'Banana'], 'Carrot'],
      ['If today is Monday, what day is after 3 days?', ['Thursday', 'Wednesday', 'Friday', 'Sunday'], 'Thursday'],
      ['A statement that must be true from given facts is called what?', ['Conclusion', 'Assumption only', 'Guess', 'Theme'], 'Conclusion'],
    ],
  },
  {
    domain: 'Business and Aptitude',
    subdomain: 'Quantitative Aptitude',
    title: 'Quantitative Aptitude Sample Quiz',
    questions: [
      ['What is 20% of 150?', ['30', '20', '25', '35'], '30'],
      ['If x + 5 = 12, what is x?', ['7', '5', '12', '17'], '7'],
      ['Average of 10, 20, 30 is?', ['20', '10', '30', '60'], '20'],
      ['If a product costs 100 and discount is 10%, price is?', ['90', '100', '110', '80'], '90'],
      ['What is 12 × 8?', ['96', '86', '108', '88'], '96'],
    ],
  },
  {
    domain: 'Business and Aptitude',
    subdomain: 'Communication',
    title: 'Communication Sample Quiz',
    questions: [
      ['Which is most important in professional communication?', ['Clarity', 'Confusion', 'Interrupting', 'Ignoring context'], 'Clarity'],
      ['Active listening means what?', ['Paying attention and responding thoughtfully', 'Only waiting to speak', 'Avoiding questions', 'Changing topic always'], 'Paying attention and responding thoughtfully'],
      ['Which tone is best for workplace emails?', ['Polite and clear', 'Rude and vague', 'Angry', 'Unstructured'], 'Polite and clear'],
      ['What should a presentation have?', ['Clear structure', 'No objective', 'Only random images', 'Hidden conclusion'], 'Clear structure'],
      ['Feedback should ideally be what?', ['Specific and constructive', 'Personal attack', 'Unclear', 'Delayed forever'], 'Specific and constructive'],
    ],
  },
  {
    domain: 'Business and Aptitude',
    subdomain: 'Case Study',
    title: 'Case Study Sample Quiz',
    questions: [
      ['What is the first step in solving a case study?', ['Understand the problem', 'Skip facts', 'Choose randomly', 'Ignore data'], 'Understand the problem'],
      ['Which evidence improves a case answer?', ['Relevant data', 'Assumptions only', 'Unrelated facts', 'No reasoning'], 'Relevant data'],
      ['A recommendation should be what?', ['Actionable', 'Vague', 'Impossible', 'Unconnected'], 'Actionable'],
      ['What helps compare solutions?', ['Criteria', 'Guesswork', 'Formatting only', 'Silence'], 'Criteria'],
      ['A good case conclusion should include what?', ['Decision and reason', 'Only title', 'Only question', 'No answer'], 'Decision and reason'],
    ],
  },
];

const seedSampleQuizzes = async () => {
  let instructor = await User.findOne({ email: 'sample.instructor@quiz.local' });

  if (!instructor) {
    instructor = await User.create({
      name: 'Sample Instructor',
      email: 'sample.instructor@quiz.local',
      password: 'sample-password',
      role: 'instructor',
    });
  }

  for (const bank of banks) {
    const existingQuiz = await Quiz.findOne({ title: bank.title, createdBy: instructor._id });
    if (existingQuiz) continue;

    const questionDocs = await Question.insertMany(bank.questions.map(([question, options, correctAnswer]) => ({
      question,
      type: 'mcq',
      options,
      correctAnswer,
      correctAnswers: [],
      createdBy: instructor._id,
    })));

    await Quiz.create({
      title: bank.title,
      description: `Practice quiz for ${bank.domain} - ${bank.subdomain}.`,
      questions: questionDocs.map((question) => question._id),
      testType: 'mcq',
      domain: bank.domain,
      subdomain: bank.subdomain,
      timeLimit: 10,
      startTime: new Date(Date.now() - 24 * 60 * 60 * 1000),
      endTime: oneYearFromNow(),
      isPublished: true,
      createdBy: instructor._id,
    });
  }

  console.log('Sample quizzes ready.');
};

module.exports = seedSampleQuizzes;
