// Load users from localStorage
let users = JSON.parse(localStorage.getItem("users")) || {};

// Current user & quiz data
let currentUser = null;
let selectedSubject = "";
let currentQuestionIndex = 0;
let score = 0;
let timer;
let userAnswers = [];

// Quiz Questions
const quizData = {
    maths: [
        { "question": "What is the value of π (pi) up to three decimal places?", "options": ["3.14", "3.141", "3.142", "3.143"], "answer": "3.142" },
        { "question": "Solve for x: 2x + 5 = 15", "options": ["5", "10", "7.5", "2.5"], "answer": "5" },
        { "question": "What is the square root of 225?", "options": ["10", "12", "15", "18"], "answer": "15" },
        { "question": "Which number is a prime number?", "options": ["49", "51", "53", "55"], "answer": "53" },
        { "question": "What is the sum of the interior angles of a hexagon?", "options": ["360°", "540°", "720°", "900°"], "answer": "720°" },
        { "question": "What is 8! (8 factorial)?", "options": ["40320", "5040", "720", "362880"], "answer": "40320" },
        { "question": "What is the logarithm of 1000 to the base 10?", "options": ["1", "2", "3", "4"], "answer": "3" },
        { "question": "How many sides does a dodecagon have?", "options": ["8", "10", "12", "14"], "answer": "12" },
        { "question": "If a train travels at 80 km/h for 3 hours, how far does it go?", "options": ["200 km", "220 km", "240 km", "260 km"], "answer": "240 km" },
        { "question": "What is the derivative of sin(x)?", "options": ["cos(x)", "-cos(x)", "sin(x)", "-sin(x)"], "answer": "cos(x)" }
    ],
    science: [
        { "question": "What is the most abundant gas in Earth's atmosphere?", "options": ["Oxygen", "Nitrogen", "Carbon Dioxide", "Argon"], "answer": "Nitrogen" },
        { "question": "Which part of the cell is responsible for energy production?", "options": ["Nucleus", "Ribosome", "Mitochondria", "Golgi Apparatus"], "answer": "Mitochondria" },
        { "question": "Which planet has the most moons?", "options": ["Jupiter", "Saturn", "Neptune", "Uranus"], "answer": "Saturn" },
        { "question": "What is the chemical symbol for gold?", "options": ["Ag", "Pb", "Au", "Fe"], "answer": "Au" },
        { "question": "Which law states that for every action, there is an equal and opposite reaction?", "options": ["Newton’s First Law", "Newton’s Second Law", "Newton’s Third Law", "Law of Conservation of Energy"], "answer": "Newton’s Third Law" },
        { "question": "Which organ in the human body produces insulin?", "options": ["Liver", "Kidney", "Pancreas", "Heart"], "answer": "Pancreas" },
        { "question": "What type of energy is stored in a stretched rubber band?", "options": ["Kinetic", "Potential", "Thermal", "Chemical"], "answer": "Potential" },
        { "question": "Which planet is known as the Morning Star?", "options": ["Mars", "Venus", "Mercury", "Jupiter"], "answer": "Venus" },
        { "question": "What is the hardest natural substance on Earth?", "options": ["Iron", "Gold", "Diamond", "Quartz"], "answer": "Diamond" },
        { "question": "Which vitamin is mainly obtained from sunlight?", "options": ["Vitamin A", "Vitamin B", "Vitamin C", "Vitamin D"], "answer": "Vitamin D" }
    ],
    english: [
        { "question": "Which word is a synonym of 'benevolent'?", "options": ["Cruel", "Kind", "Angry", "Evil"], "answer": "Kind" },
        { "question": "What is the plural of 'phenomenon'?", "options": ["Phenomenas", "Phenomenon", "Phenomena", "Phenomenons"], "answer": "Phenomena" },
        { "question": "Identify the correctly punctuated sentence.", "options": ["Its a beautiful day!", "It's a beautiful day!", "Its' a beautiful day!", "Its's a beautiful day!"], "answer": "It's a beautiful day!" },
        { "question": "Which is an example of a simile?", "options": ["She is a shining star", "Her smile was like the sun", "The wind whispered through the trees", "Time is a thief"], "answer": "Her smile was like the sun" },
        { "question": "What is the past participle of 'swim'?", "options": ["Swimmed", "Swam", "Swum", "Swim"], "answer": "Swum" },
        { "question": "Which word is a homonym?", "options": ["Lead (metal) & Lead (to guide)", "Run & Ran", "Big & Small", "Fast & Slow"], "answer": "Lead (metal) & Lead (to guide)" },
        { "question": "What is an oxymoron?", "options": ["A contradiction", "A simile", "A metaphor", "A synonym"], "answer": "A contradiction" }
    ],
    history: [
        { "question": "Who was the first Emperor of China?", "options": ["Qin Shi Huang", "Kublai Khan", "Sun Yat-sen", "Mao Zedong"], "answer": "Qin Shi Huang" },
        { "question": "Which war was fought between the Royalists and Parliamentarians in England?", "options": ["Hundred Years' War", "War of Roses", "English Civil War", "Napoleonic Wars"], "answer": "English Civil War" },
        { "question": "Which ancient civilization built the Machu Picchu?", "options": ["Maya", "Inca", "Aztec", "Olmec"], "answer": "Inca" },
        { "question": "Who was the first ruler of the Maurya Empire?", "options": ["Ashoka", "Chandragupta Maurya", "Bindusara", "Harsha"], "answer": "Chandragupta Maurya" },
        { "question": "Which treaty ended World War I?", "options": ["Treaty of Paris", "Treaty of Versailles", "Treaty of Tordesillas", "Treaty of Ghent"], "answer": "Treaty of Versailles" },
        { "question": "Who led the Bolshevik Revolution in Russia in 1917?", "options": ["Joseph Stalin", "Vladimir Lenin", "Leon Trotsky", "Mikhail Gorbachev"], "answer": "Vladimir Lenin" },
        { "question": "Who discovered the sea route to India?", "options": ["Christopher Columbus", "Vasco da Gama", "Marco Polo", "Ferdinand Magellan"], "answer": "Vasco da Gama" },
        { "question": "Which empire was ruled by Genghis Khan?", "options": ["Ottoman Empire", "Mongol Empire", "Byzantine Empire", "Roman Empire"], "answer": "Mongol Empire" },
        { "question": "The Great Fire of London occurred in which year?", "options": ["1666", "1642", "1776", "1804"], "answer": "1666" },
        { "question": "Who was the first President of the United States?", "options": ["Abraham Lincoln", "George Washington", "Thomas Jefferson", "John Adams"], "answer": "George Washington" }
    ]
};

// Email validation function
function isValidEmail(email) {
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.(com|net|org|edu|gov|in|us|uk|ca|au)$/;
    return emailPattern.test(email);

}

// Show pages
function showRegister() {
    document.getElementById("loginPage").classList.add("hidden");
    document.getElementById("registerPage").classList.remove("hidden");
}

function showLogin() {
    document.getElementById("registerPage").classList.add("hidden");
    document.getElementById("loginPage").classList.remove("hidden");
}

// Register user
function register() {
    let email = document.getElementById("regEmail").value;
    let password = document.getElementById("regPassword").value;

    if (!isValidEmail(email)) {
        alert("Please enter correct email format.");
        return;
    }

    if (users[email]) {
        alert("Email already registered! Please login.");
        showLogin();
        return;
    }

    users[email] = password;
    localStorage.setItem("users", JSON.stringify(users));
    alert("Registration successful! Please login.");
    showLogin();
}

// Login user
function login() {
    let email = document.getElementById("email").value;
    let password = document.getElementById("password").value;

    if (!isValidEmail(email)) {
        alert("Please enter correct email format.");
        return;
    }

    if (!users[email]) {
        alert("You are not registered. Please register first...");
        return;
    }

    if (users[email] !== password) {
        alert("Incorrect password! Please try again.");
        return;
    }

    currentUser = email;
    document.getElementById("loginPage").classList.add("hidden");
    document.getElementById("subjectPage").classList.remove("hidden");
}

// Subject selection
function selectSubject(subject) {
    selectedSubject = subject;
    document.getElementById("subjectPage").classList.add("hidden");
    document.getElementById("quizStartPage").classList.remove("hidden");

    let countdown = 3;
    let countdownInterval = setInterval(() => {
        document.getElementById("countdown").innerText = countdown;
        countdown--;
        if (countdown < 0) {
            clearInterval(countdownInterval);
            startQuiz();
        }
    }, 1000);
}

// Start quiz
function startQuiz() {
    document.getElementById("quizStartPage").classList.add("hidden");
    document.getElementById("quizPage").classList.remove("hidden");

    currentQuestionIndex = 0;
    score = 0;
    loadQuestion();
}

// Load quiz questions
function loadQuestion() {
    if (currentQuestionIndex >= 10) {
        endQuiz();
        return;
    }

    let questionData = quizData[selectedSubject][currentQuestionIndex];
    document.getElementById("quizHeading").innerText = `Quiz: ${selectedSubject.toUpperCase()}`;
    document.getElementById("question").innerText = questionData.question;

    let optionsContainer = document.getElementById("options");
    optionsContainer.innerHTML = "";

    questionData.options.forEach(option => {
        let button = document.createElement("button");
        button.innerText = option;
        button.onclick = () => checkAnswer(option, questionData.answer);
        optionsContainer.appendChild(button);
    });

    startTimer();
}

// Start timer
function startTimer() {
    let timeLeft = 5;
    document.getElementById("timer").innerText = timeLeft;

    timer = setInterval(() => {
        timeLeft--;
        document.getElementById("timer").innerText = timeLeft;

        if (timeLeft <= 0) {
            clearInterval(timer);
            nextQuestion();
        }
    }, 1000);
}

// Check answer
function checkAnswer(selected, correct) {
    clearInterval(timer);
    userAnswers.push({
        question: quizData[selectedSubject][currentQuestionIndex].question,
        selected: selected,
        correct: correct
    });
    if (selected === correct) {
        score++;
    }
    nextQuestion();
}

// Move to next question
function nextQuestion() {
    currentQuestionIndex++;
    loadQuestion();
}

// End quiz and show result
function endQuiz() {
    document.getElementById("quizPage").classList.add("hidden");
    document.getElementById("resultPage").classList.remove("hidden");

    let totalQuestions = 10; 

    let message = (score === totalQuestions) 
        ? " Excellent! You got all questions correct!" 
        : (score >= totalQuestions * 0.8)  
            ? ` Great! You got ${score} out of ${totalQuestions} correct!` 
            : (score >= totalQuestions * 0.5)  
                ? ` Good job! You got ${score} out of ${totalQuestions}. Keep practicing!` 
                : ` You got ${score} out of ${totalQuestions}. Try again!`;

    document.getElementById("scoreMessage").innerText = message;
    let resultDetails = document.getElementById("resultDetails");
    resultDetails.innerHTML = "<h3>Quiz Summary</h3>";

    userAnswers.forEach((item, index) => {
        let status = item.selected === item.correct ? "✔️ Correct" : "❌ Wrong";
        let answerText = `<p><strong>Q${index + 1}:</strong> ${item.question}<br>
                          <strong>Your Answer:</strong> ${item.selected} ${status}<br>
                          <strong>Correct Answer:</strong> ${item.correct}</p>`;
        resultDetails.innerHTML += answerText;
    });
}

// Restart Quiz
function restartQuiz() {
    document.getElementById("resultPage").classList.add("hidden");
    document.getElementById("subjectPage").classList.remove("hidden");
}

