const questionCountSelect = document.getElementById('questionCount');
const operationModeSelect = document.getElementById('operationMode');
const startBtn = document.getElementById('startBtn');

const quizCard = document.getElementById('quizCard');
const resultCard = document.getElementById('resultCard');
const progressText = document.getElementById('progressText');
const scoreText = document.getElementById('scoreText');
const questionText = document.getElementById('questionText');
const answerForm = document.getElementById('answerForm');
const answerInput = document.getElementById('answerInput');
const feedbackText = document.getElementById('feedbackText');
const finalScoreText = document.getElementById('finalScoreText');
const retryBtn = document.getElementById('retryBtn');

const operationOptions = {
  add: ['+'],
  subtract: ['−'],
  multiply: ['×'],
  divide: ['÷'],
  mixed: ['+', '−', '×', '÷']
};

let state = null;

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function chooseOperation(mode) {
  const list = operationOptions[mode] ?? operationOptions.mixed;
  return list[randomInt(0, list.length - 1)];
}

function generateQuestion(mode) {
  const operation = chooseOperation(mode);

  if (operation === '+') {
    const a = randomInt(1, 50);
    const b = randomInt(1, 50);
    return { text: `${a} + ${b}`, answer: a + b };
  }

  if (operation === '−') {
    const a = randomInt(10, 99);
    const b = randomInt(1, a);
    return { text: `${a} − ${b}`, answer: a - b };
  }

  if (operation === '×') {
    const a = randomInt(2, 12);
    const b = randomInt(2, 12);
    return { text: `${a} × ${b}`, answer: a * b };
  }

  const divisor = randomInt(2, 12);
  const answer = randomInt(2, 12);
  const dividend = divisor * answer;
  return { text: `${dividend} ÷ ${divisor}`, answer };
}

function renderQuestion() {
  const current = state.questions[state.currentIndex];
  progressText.textContent = `Question ${state.currentIndex + 1} / ${state.total}`;
  scoreText.textContent = `Score: ${state.score}`;
  questionText.textContent = `${current.text} = ?`;
  feedbackText.textContent = '';
  feedbackText.className = 'feedback';
  answerInput.value = '';
  answerInput.focus();
}

function startQuiz() {
  const total = Number(questionCountSelect.value);
  const mode = operationModeSelect.value;

  state = {
    total,
    score: 0,
    currentIndex: 0,
    questions: Array.from({ length: total }, () => generateQuestion(mode))
  };

  resultCard.classList.add('hidden');
  quizCard.classList.remove('hidden');
  renderQuestion();
}

function finishQuiz() {
  quizCard.classList.add('hidden');
  resultCard.classList.remove('hidden');
  finalScoreText.textContent = `You answered ${state.score} out of ${state.total} correctly.`;
}

function gradeAnswer(userAnswer) {
  const current = state.questions[state.currentIndex];

  if (userAnswer === current.answer) {
    state.score += 1;
    feedbackText.textContent = 'Correct ✅';
    feedbackText.className = 'feedback good';
  } else {
    feedbackText.textContent = `Not quite. Correct answer: ${current.answer}`;
    feedbackText.className = 'feedback bad';
  }

  scoreText.textContent = `Score: ${state.score}`;

  window.setTimeout(() => {
    state.currentIndex += 1;
    if (state.currentIndex >= state.total) {
      finishQuiz();
      return;
    }
    renderQuestion();
  }, 650);
}

startBtn.addEventListener('click', startQuiz);
retryBtn.addEventListener('click', startQuiz);

answerForm.addEventListener('submit', (event) => {
  event.preventDefault();

  if (!state) {
    return;
  }

  const value = Number(answerInput.value);
  if (!Number.isFinite(value)) {
    return;
  }

  gradeAnswer(value);
});


function initQuiz() {
  startQuiz();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initQuiz);
} else {
  initQuiz();
}
