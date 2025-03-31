document.addEventListener('DOMContentLoaded', function() {
    const startScreen = document.querySelector('.start-screen');
    const gameScreen = document.querySelector('.game-screen');
    const resultScreen = document.querySelector('.result-screen');
    const startBtn = document.querySelector('.start-btn');
    const restartBtn = document.querySelector('.restart-btn');
    const problem = document.querySelector('.problem');
    const choices = document.querySelectorAll('.choice');
    const timer = document.querySelector('.timer');
    const hearts = document.querySelectorAll('.heart');
    const progress = document.querySelector('.progress');
    const resultText = document.querySelector('.result-text');
    const quote = document.querySelector('.quote');
    const container = document.querySelector('.container');

    let currentProblem = {};
    let remainingHearts = 3;
    let timeLeft = 5;
    let timerInterval;
    let correctAnswers = 0;
    let currentQuestion = 0;
    const totalQuestions = 10;

    const quotes = [
        "Great! You have excellent mathematical abilities.",
        "superb! You have fast and accurate calculation skills.",
        "unbelievable! You can calculate as fast as a computer.",
        "the best! You are a real mathematical genius.",
        "Excellent! Your math speed would put Einstein to shame."
    ];

    startBtn.addEventListener('click', startGame);
    restartBtn.addEventListener('click', restartGame);

    choices.forEach(choice => {
        choice.addEventListener('click', checkAnswer);
    });

    function startGame() {
        startScreen.style.display = 'none';
        gameScreen.style.display = 'block';
        gameScreen.classList.add('fade-in');
        
        resetGame();
        generateProblem();
        startTimer();
    }

    function restartGame() {
        resultScreen.style.display = 'none';
        gameScreen.style.display = 'block';
        gameScreen.classList.add('fade-in');
        
        const confetti = document.querySelectorAll('.confetti');
        confetti.forEach(c => c.remove());
        
        choices.forEach(choice => {
            choice.classList.remove('correct', 'incorrect');
            choice.style.pointerEvents = 'auto';
            choice.style.animation = 'none';
        });

        resetGame();
        generateProblem();
        startTimer();
    }

    function resetGame() {
        remainingHearts = 3;
        correctAnswers = 0;
        currentQuestion = 0;
        
        hearts.forEach(heart => {
            heart.innerHTML = '❤️';
            heart.style.opacity = 1;
        });
        
        progress.textContent = `Question number 1/${totalQuestions}`;
    }

    function startTimer() {
        timeLeft = 5;
        timer.textContent = timeLeft;
        
        timer.parentElement.style.background = 'linear-gradient(to right, #fd746c, #ff9068)';
        
        clearInterval(timerInterval);
        timerInterval = setInterval(() => {
            timeLeft--;
            timer.textContent = timeLeft;
            
            if (timeLeft <= 2) {
                timer.parentElement.style.background = 'linear-gradient(to right, #ff416c, #ff4b2b)';
                timer.parentElement.classList.add('pulse');
            }
            
            if (timeLeft <= 0) {
                clearInterval(timerInterval);
                timer.parentElement.classList.remove('pulse');
                loseHeart();
                nextQuestion();
            }
        }, 1000);
    }

    function loseHeart() {
        if (remainingHearts > 0) {
            remainingHearts--;
            hearts[remainingHearts].innerHTML = '💔';
            hearts[remainingHearts].classList.add('pulse');
            
            setTimeout(() => {
                hearts[remainingHearts].classList.remove('pulse');
            }, 600);
            
            if (remainingHearts === 0) {
                endGame(false);
            }
        }
    }

    function generateProblem() {
        const operation = Math.floor(Math.random() * 6);
        let num1, num2, answer, problemText;
        
        switch (operation) {
            case 0: // Addition
                num1 = Math.floor(Math.random() * 50) + 1;
                num2 = Math.floor(Math.random() * 50) + 1;
                answer = num1 + num2;
                problemText = `${num1} + ${num2} = ?`;
                console.log(answer); //dev test
                break;
            
            case 1: // Subtraction
                num1 = Math.floor(Math.random() * 50) + 51;
                num2 = Math.floor(Math.random() * 50) + 1;
                answer = num1 - num2;
                problemText = `${num1} - ${num2} = ?`;
                console.log(answer); //dev test
                break;
            
            case 2: // Multiplication
                num1 = Math.floor(Math.random() * 12) + 1;
                num2 = Math.floor(Math.random() * 12) + 1;
                answer = num1 * num2;
                problemText = `${num1} × ${num2} = ?`;
                console.log(answer); //dev test
                break;
            
            case 3: // Division
                num2 = Math.floor(Math.random() * 10) + 1;
                answer = Math.floor(Math.random() * 10) + 1;
                num1 = num2 * answer;
                problemText = `${num1} ÷ ${num2} = ?`;
                console.log(answer); //dev test
                break;
            
            case 4: // Power
                num1 = Math.floor(Math.random() * 10) + 1;
                num2 = Math.floor(Math.random() * 2) + 2; // Power of 2 or 3
                answer = Math.pow(num1, num2);
                problemText = `${num1}<sup>${num2}</sup> = ?`;
                console.log(answer); //dev test
                break;
            
            case 5: // Square root
                answer = Math.floor(Math.random() * 10) + 1;
                num1 = answer * answer;
                problemText = `√${num1} = ?`;
                console.log(answer); //dev test
                break;
        }
        
        currentProblem = {
            problemText,
            answer
        };
        
        problem.innerHTML = problemText;
        
        generateChoices(answer);
        
        currentQuestion++;
        progress.textContent = `Question number ${currentQuestion}/${totalQuestions}`;
    }

    function generateChoices(correctAnswer) {
        const choiceValues = [correctAnswer];
        
        while (choiceValues.length < 4) {
            let wrongAnswer;
            if (correctAnswer < 10) {
                wrongAnswer = Math.floor(Math.random() * 20) + 1;
            } else {
                const minValue = Math.max(1, correctAnswer - 10);
                const maxValue = correctAnswer + 10;
                wrongAnswer = Math.floor(Math.random() * (maxValue - minValue + 1)) + minValue;
            }
            
            if (wrongAnswer !== correctAnswer && !choiceValues.includes(wrongAnswer)) {
                choiceValues.push(wrongAnswer);
            }
        }
        
        shuffleArray(choiceValues);
        
        choices.forEach((choice, index) => {
            choice.textContent = choiceValues[index];
            choice.classList.remove('correct', 'incorrect');
            choice.setAttribute('data-value', choiceValues[index]);
        });
    }

    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    function checkAnswer(event) {
        clearInterval(timerInterval);
        timer.parentElement.classList.remove('pulse');
        
        const selectedChoice = event.target;
        const selectedValue = parseInt(selectedChoice.getAttribute('data-value'));
        
        if (selectedValue === currentProblem.answer) {
            selectedChoice.classList.add('correct');
            correctAnswers++;
        } else {
            selectedChoice.classList.add('incorrect');
            
            choices.forEach(choice => {
                if (parseInt(choice.getAttribute('data-value')) === currentProblem.answer) {
                    choice.classList.add('correct');
                }
            });
            
            loseHeart();
        }
        
        choices.forEach(choice => {
            choice.style.pointerEvents = 'none';
        });
        
        setTimeout(() => {
            if (currentQuestion < totalQuestions && remainingHearts > 0) {
                nextQuestion();
            } else if (remainingHearts > 0) {
                endGame(true);
            }
        }, 1200);
    }

    function nextQuestion() {

        choices.forEach(choice => {
            choice.classList.remove('correct', 'incorrect');
            choice.style.pointerEvents = 'auto';
        });
        

        problem.style.animation = 'fadeOut 0.3s ease forwards';
        
        setTimeout(() => {
            generateProblem();
            problem.style.animation = 'fadeIn 0.3s ease forwards';
            startTimer();
        }, 300);
    }

    function createConfetti() {
        const colors = ['#ff4e50', '#fc913a', '#f9d423', '#ede574', '#e1f5c4', '#add8e6', '#94c5f8', '#a6a6ed'];
        
        for (let i = 0; i < 100; i++) {
            const confetti = document.createElement('div');
            confetti.className = 'confetti';
            confetti.style.left = Math.random() * 100 + 'vw';
            confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
            confetti.style.width = (Math.random() * 10 + 5) + 'px';
            confetti.style.height = (Math.random() * 10 + 5) + 'px';
            confetti.style.opacity = Math.random();
            confetti.style.animationDuration = (Math.random() * 3 + 2) + 's';
            
            document.body.appendChild(confetti);
            
            setTimeout(() => {
                confetti.remove();
            }, 5000);
        }
    }

    function endGame(completed) {
        clearInterval(timerInterval);
        gameScreen.style.display = 'none';
        resultScreen.style.display = 'flex';
        resultScreen.classList.add('fade-in');
        
        if (completed) {
            if (correctAnswers === totalQuestions) {
                resultText.textContent = '🏆 Good Job! You cook';
                const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
                quote.textContent = randomQuote;
                
                createConfetti();
            } else if (correctAnswers >= totalQuestions - 2) {
                resultText.textContent = '👏 Well done.! Just a little bit more to get full score.';
                quote.textContent = `You correct ${correctAnswers} out of ${totalQuestions} Questions`;
            } else {
                resultText.textContent = '🎮 Finished playing!';
                quote.textContent = `You correct ${correctAnswers} out of ${totalQuestions} Questions`;
            }
        } else {
            resultText.textContent = '💔 out of heart! Game Over';
            quote.textContent = `You correct ${correctAnswers} out of ${currentQuestion} Questions`;
            
            container.classList.add('shake');
            setTimeout(() => {
                container.classList.remove('shake');
            }, 500);
        }
    }
    
    const style = document.createElement('style');
    style.textContent = `
        @keyframes shake {
            0%, 100% { transform: translateX(0); }
            10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
            20%, 40%, 60%, 80% { transform: translateX(5px); }
        }
        .shake {
            animation: shake 0.5s ease;
        }
    `;
    document.head.appendChild(style);
});