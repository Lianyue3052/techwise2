/**
 * Game Engine - 3x3 Grid Version
 * Tracks completion of 9 missions across 3 tiers.
 */
class GameEngine {
    constructor() {
        this.gameState = this.loadState() || {
            completedQuizzes: []
        };

        // Configuration: 3 Quizzes per Tier
        this.tiers = {
            easy: ['email_quiz', 'device_quiz', 'social_quiz'],
            medium: ['password_quiz', '2fa_quiz', 'update_quiz'],
            hard: ['phish_quiz', 'malware_quiz', 'wifi_quiz']
        };
    }

    // --- Persistence ---
    loadState() {
        // Using v3 to prevent conflicts with old simple version
        const saved = localStorage.getItem('techwise_save_v3');
        return saved ? JSON.parse(saved) : null;
    }

    saveState() {
        localStorage.setItem('techwise_save_v3', JSON.stringify(this.gameState));
        this.updateUI();
    }

    // --- Logic ---
    completeQuiz(quizId) {
        if (!this.gameState.completedQuizzes.includes(quizId)) {
            this.gameState.completedQuizzes.push(quizId);
            this.saveState();
            this.showToast('Mission Accomplished!', 'Progress Saved.');
        }
    }

    isTierUnlocked(tier) {
        return true; // All tiers unlocked
    }

    getQuizStatus(quizId) {
        return this.gameState.completedQuizzes.includes(quizId) ? 'completed' : 'pending';
    }

    // --- UI ---
    updateUI() {
        // Update Section Locks
        ['medium', 'hard'].forEach(tier => {
            const section = document.getElementById(`section-${tier}`);
            if (section) {
                if (this.isTierUnlocked(tier)) {
                    section.classList.remove('locked-section');
                    // Enable links inside
                    const links = section.querySelectorAll('a');
                    links.forEach(link => link.style.pointerEvents = 'auto');
                } else {
                    section.classList.add('locked-section');
                    // Disable links inside
                    const links = section.querySelectorAll('a');
                    links.forEach(link => link.style.pointerEvents = 'none');
                }
            }
        });

        // Update Quiz Checkmarks (Visual feedback for done quizzes)
        // Access all known quizzes
        Object.values(this.tiers).flat().forEach(quizId => {
            const el = document.getElementById(`card-${quizId}`);
            if (el) {
                if (this.gameState.completedQuizzes.includes(quizId)) {
                    el.classList.add('completed');
                    const badge = el.querySelector('.mission-status');
                    if (badge) badge.textContent = '✅ COMPLETED';
                }
            }
        });
    }

    showToast(title, message) {
        let container = document.querySelector('.game-toast-container');
        if (!container) {
            container = document.createElement('div');
            container.className = 'game-toast-container';
            document.body.appendChild(container);
        }

        const toast = document.createElement('div');
        toast.className = 'game-toast';
        toast.innerHTML = `
            <div class="toast-icon">✅</div>
            <div class="toast-content">
                <div class="toast-title">${title}</div>
                <div class="toast-desc">${message}</div>
            </div>
        `;

        container.appendChild(toast);
        setTimeout(() => toast.remove(), 3000);
    }
}

window.Game = new GameEngine();
window.addEventListener('DOMContentLoaded', () => window.Game.updateUI());
