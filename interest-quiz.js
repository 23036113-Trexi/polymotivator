console.log("Quiz Page Loaded");

/**
 * Interest Quiz Page Controller
 * Manages the flow: Section 1 (Welcome) → Section 2 (Quiz) → Section 3 (Agent)
 */

class InterestQuizController {
    constructor() {
        this.state = {
            currentSection: 1,
            quizStarted: false,
            quizCompleted: false,
        };

        this.init();
    }

    /**
     * Initialize the controller
     */
    init() {
        this.cacheElements();
        this.setupEventListeners();
        console.log("Quiz Controller initialized - All sections visible");
    }

    /**
     * Cache DOM elements
     */
    cacheElements() {
        this.elements = {
            section1: document.querySelector('.welcome-section'),
            section2: document.querySelector('.quiz-section'),
            section3: document.querySelector('.agent-section'),
            botpressWebchat: document.getElementById('botpress-webchat'),
            flowiseChatbot: document.getElementById('flowise-chatbot'),
            welcomeVideo: document.getElementById('welcome-video'),
            guidanceVideo: document.getElementById('guidance-video'),
        };
    }

    /**
     * Setup event listeners
     */
    setupEventListeners() {
        // Listen for custom quiz complete event from Botpress
        window.addEventListener('quizComplete', () => {
            this.onQuizComplete();
        });

        // Optional: Listen for manual section transitions
        window.addEventListener('showQuiz', () => {
            this.markQuizStarted();
        });

        window.addEventListener('showAgent', () => {
            this.markQuizCompleted();
        });
    }

    /**
     * Mark quiz as started
     */
    markQuizStarted() {
        this.state.quizStarted = true;
        this.state.currentSection = 2;
        console.log("Quiz started");
    }

    /**
     * Mark quiz as completed
     */
    onQuizComplete() {
        this.state.quizCompleted = true;
        this.state.currentSection = 3;
        console.log("Quiz completed");
    }

    /**
     * Mark quiz as completed (alternate method)
     */
    markQuizCompleted() {
        this.onQuizComplete();
    }

    /**
     * Public method: Get current state
     */
    getState() {
        return { ...this.state };
    }

    /**
     * Public method: Load Botpress webchat (if needed)
     */
    loadBotpress() {
        if (this.elements.botpressWebchat) {
            console.log("Botpress webchat ready at:", this.elements.botpressWebchat);
        }
    }

    /**
     * Public method: Load Flowise chatbot (if needed)
     */
    loadFlowise() {
        if (this.elements.flowiseChatbot) {
            console.log("Flowise chatbot ready at:", this.elements.flowiseChatbot);
        }
    }
}

/**
 * Initialize the quiz controller when DOM is ready
 */
document.addEventListener('DOMContentLoaded', () => {
    window.quizController = new InterestQuizController();
    console.log("Quiz Controller initialized");

    // Prevent auto-scroll from iframe or external sources
    window.scrollTo(0, 0);

    // Disable iframe interactions temporarily to prevent auto-scroll
    const botpressIframe = document.getElementById('botpress-iframe');
    if (botpressIframe) {
        botpressIframe.style.pointerEvents = 'none';

        // Re-enable interactions after a short delay
        setTimeout(() => {
            botpressIframe.style.pointerEvents = 'auto';
        }, 500);
    }
});

// Prevent scroll to iframe when page loads
window.addEventListener('load', () => {
    window.scrollTo(0, 0);
});

// Block any scroll events in the first 2 seconds
let scrollBlocked = true;
setTimeout(() => {
    scrollBlocked = false;
}, 2000);

window.addEventListener('scroll', () => {
    if (scrollBlocked) {
        window.scrollTo(0, 0);
    }
}, { passive: false });

// ========================================
// MUSIC PLAYER FUNCTIONALITY
// ========================================
document.addEventListener('DOMContentLoaded', () => {
    const musicAudio = document.getElementById('study-music');
    const musicToggleBtn = document.getElementById('music-toggle-btn');

    if (musicAudio && musicToggleBtn) {
        // Toggle music play/pause
        musicToggleBtn.addEventListener('click', () => {
            if (musicAudio.paused) {
                musicAudio.play();
                musicToggleBtn.classList.add('playing');
                console.log("Music started");
            } else {
                musicAudio.pause();
                musicToggleBtn.classList.remove('playing');
                console.log("Music paused");
            }
        });

        // Update button state when audio ends
        musicAudio.addEventListener('ended', () => {
            musicToggleBtn.classList.remove('playing');
        });

        // Handle audio play event
        musicAudio.addEventListener('play', () => {
            musicToggleBtn.classList.add('playing');
        });

        // Handle audio pause event
        musicAudio.addEventListener('pause', () => {
            musicToggleBtn.classList.remove('playing');
        });
    }
});


