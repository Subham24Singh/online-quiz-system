// Load users from localStorage
let users = JSON.parse(localStorage.getItem("users")) || {};

// Current user & quiz data
let currentUser = null;
let selectedSubject = "";
let currentQuestionIndex = 0;
let score = 0;
let timer;

// Quiz Questions
const quizData = {
    maths: [
        { question: "2 + 2 = ?", options: ["3", "4", "5", "6"], answer: "4" },
        { question: "5 × 6 = ?", options: ["11", "30", "25", "35"], answer: "30" },
        { question: "10 ÷ 2 = ?", options: ["2", "5", "10", "20"], answer: "5" },
        { question: "Square root of 16?", options: ["2", "4", "6", "8"], answer: "4" }
    ],
    science: [
        { question: "What is H₂O?", options: ["Oxygen", "Hydrogen", "Water", "Helium"], answer: "Water" },
        { question: "What planet is known as the Red Planet?", options: ["Mars", "Venus", "Earth", "Jupiter"], answer: "Mars" },
        { question: "Sun is a?", options: ["Planet", "Moon", "Star", "Asteroid"], answer: "Star" },
        { question: "Which gas do plants release?", options: ["Oxygen", "Carbon", "Nitrogen", "Helium"], answer: "Oxygen" }
    ],
    english: [
        { question: "Synonym of 'Happy'?", options: ["Sad", "Angry", "Joyful", "Bored"], answer: "Joyful" },
        { question: "Antonym of 'Big'?", options: ["Small", "Huge", "Tall", "Wide"], answer: "Small" },
        { question: "Which is a noun?", options: ["Run", "Jump", "Book", "Fast"], answer: "Book" },
        { question: "Plural of 'Child'?", options: ["Childs", "Children", "Childes", "Chil"], answer: "Children" }
    ],
    history: [
        { question: "Who discovered America?", options: ["Columbus", "Newton", "Einstein", "Galileo"], answer: "Columbus" },
        { question: "Who was the first US President?", options: ["Lincoln", "Washington", "Roosevelt", "Jefferson"], answer: "Washington" },
        { question: "Year of World War I?", options: ["1914", "1939", "1945", "1901"], answer: "1914" },
        { question: "Who built the Taj Mahal?", options: ["Akbar", "Shah Jahan", "Babur", "Aurangzeb"], answer: "Shah Jahan" }
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
    if (currentQuestionIndex >= 4) {
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

    let message = score === 4 ? " Good! You got all 4 correct!" :
                  score === 3 ? " Nice! You got 3 out of 4 correct!" :
                               ` You got ${score} out of 4 correct. Try again!`;

    document.getElementById("scoreMessage").innerText = message;
}

// Restart Quiz
function restartQuiz() {
    document.getElementById("resultPage").classList.add("hidden");
    document.getElementById("subjectPage").classList.remove("hidden");
}
