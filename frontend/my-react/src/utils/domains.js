export const testTypes = [
  { value: 'mcq', label: 'MCQ Test' },
  { value: 'multiple_answer', label: 'Multiple Answer Test' },
  { value: 'assessment', label: 'Assessment Test' },
  { value: 'written', label: 'Written Exam' },
];

export const domainCatalog = [
  {
    domain: 'CSE and IT',
    subdomains: ['Cloud Computing', 'Full Stack', 'Cyber Security', 'Data Structures'],
  },
  {
    domain: 'AI and Gen AI',
    subdomains: ['Machine Learning', 'Deep Learning', 'Generative AI', 'Prompt Engineering'],
  },
  {
    domain: 'Business and Aptitude',
    subdomains: ['Logical Reasoning', 'Quantitative Aptitude', 'Communication', 'Case Study'],
  },
];

export const sampleQuestions = [
  {
    domain: 'CSE and IT',
    subdomain: 'Cloud Computing',
    question: 'Which cloud service model gives developers runtime, database, and deployment tools without managing servers?',
    type: 'MCQ',
    options: ['IaaS', 'PaaS', 'SaaS', 'DaaS'],
  },
  {
    domain: 'CSE and IT',
    subdomain: 'Full Stack',
    question: 'In a MERN application, which layer usually exposes REST API endpoints?',
    type: 'MCQ',
    options: ['MongoDB', 'Express.js', 'React.js', 'CSS'],
  },
  {
    domain: 'CSE and IT',
    subdomain: 'Cyber Security',
    question: 'Select all practices that help prevent account compromise.',
    type: 'Multiple Answer',
    options: ['Multi-factor authentication', 'Password reuse', 'Phishing awareness', 'Publicly sharing API keys'],
  },
  {
    domain: 'AI and Gen AI',
    subdomain: 'Generative AI',
    question: 'Write a short answer explaining why prompt clarity affects the quality of a generated response.',
    type: 'Written',
    options: [],
  },
  {
    domain: 'AI and Gen AI',
    subdomain: 'Machine Learning',
    question: 'Which metric is commonly used for classification model evaluation?',
    type: 'MCQ',
    options: ['Accuracy', 'Latency only', 'Screen size', 'Port number'],
  },
  {
    domain: 'Business and Aptitude',
    subdomain: 'Logical Reasoning',
    question: 'If all analysts are learners and some learners are coders, what can definitely be concluded?',
    type: 'Assessment',
    options: [],
  },
];
