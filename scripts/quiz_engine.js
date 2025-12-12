/**
 * Quiz Engine for TechWise
 * Handles quiz logic, lives, and Game interactions.
 */
class QuizEngine {
    constructor(config) {
        this.quizId = config.quizId;
        this.questions = config.questions;
        this.onComplete = config.onComplete;

        this.currentIndex = 0;
        this.lives = 3;
        this.score = 0;

        this.elements = {
            question: document.getElementById('question'),
            options: document.getElementById('options'),
            lives: document.getElementById('lives-display'),
            feedback: document.getElementById('feedback'),
            progress: document.getElementById('progress-dots')
        };

        this.init();
    }

    init() {
        this.renderLives();
        this.renderQuestion();
    }

    renderLives() {
        if (this.elements.lives) {
            this.elements.lives.innerHTML = '❤️'.repeat(this.lives);
        }
    }

    renderQuestion() {
        const q = this.questions[this.currentIndex];

        // Progress Dots
        if (this.elements.progress) {
            this.elements.progress.innerHTML = '';
            for (let i = 0; i < this.questions.length; i++) {
                const dot = document.createElement('span');
                dot.classList.add('dot');
                if (i < this.currentIndex) dot.classList.add('filled');
                if (i === this.currentIndex) dot.classList.add('current');
                this.elements.progress.appendChild(dot);
            }
        }

        // Question Text
        this.elements.question.textContent = q.question;

        // Options
        this.elements.options.innerHTML = '';
        q.choices.forEach(choice => {
            const btn = document.createElement('button');
            btn.className = 'option';
            btn.textContent = choice.text;
            btn.onclick = () => this.handleAnswer(btn, choice.id);
            this.elements.options.appendChild(btn);
        });

        // Hide feedback
        if (this.elements.feedback) {
            this.elements.feedback.hidden = true;
            this.elements.feedback.className = '';
        }
    }

    handleAnswer(btn, choiceId) {
        if (btn.disabled) return;

        const q = this.questions[this.currentIndex];
        const isCorrect = choiceId === q.correctChoiceId;

        // Disable all
        const allBtns = this.elements.options.querySelectorAll('.option');
        allBtns.forEach(b => b.disabled = true);

        if (isCorrect) {
            btn.classList.add('correct');
            this.score++;
            window.Game.showToast('Correct!', 'Keep it up!');
        } else {
            btn.classList.add('wrong');

            this.lives--;
            this.renderLives();
            window.Game.showToast('Wrong!', 'You lost a life.');

            if (this.lives === 0) {
                this.gameOver();
                return;
            }
        }

        // Feedback
        if (this.elements.feedback) {
            this.elements.feedback.textContent = isCorrect ? 'Correct! ' + q.explanation : 'Incorrect. ' + q.explanation;
            this.elements.feedback.className = isCorrect ? 'correct visible' : 'wrong visible';
            this.elements.feedback.hidden = false;
        }

        setTimeout(() => {
            this.nextQuestion();
        }, 2000);
    }

    nextQuestion() {
        this.currentIndex++;
        if (this.currentIndex < this.questions.length) {
            this.renderQuestion();
        } else {
            this.finishQuiz();
        }
    }

    finishQuiz() {
        // Simplified API call for simplified Game Engine
        window.Game.completeQuiz(this.quizId);

        const modalHtml = `
            <div class="game-modal-overlay active">
                <div class="game-modal">
                    <div class="modal-icon">🏆</div>
                    <h2 class="modal-title">Mission Complete!</h2>
                    <p class="modal-message">Training Module Passed based on Ease/Medium/Hard Difficulty.</p>
                    <button class="game-btn" onclick="window.location.href='main.html'">Main Menu</button>
                    <button class="game-btn" onclick="location.reload()" style="margin-top:10px; background:transparent; color:#0071e3">Replay</button>
                </div>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', modalHtml);
    }

    gameOver() {
        const modalHtml = `
            <div class="game-modal-overlay active">
                <div class="game-modal">
                    <div class="modal-icon">💔</div>
                    <h2 class="modal-title">Mission Failed</h2>
                    <p class="modal-message">You ran out of lives!</p>
                    <button class="game-btn" onclick="location.reload()">Try Again</button>
                    <button class="game-btn" onclick="window.location.href='main.html'" style="margin-top:10px; background:transparent; color:#0071e3">Return to Base</button>
                </div>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', modalHtml);
    }
}
