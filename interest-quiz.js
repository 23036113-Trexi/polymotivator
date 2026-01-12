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

    // Prevent Botpress iframe from auto-scrolling the page
    const botpressIframe = document.getElementById('botpress-iframe');
    if (botpressIframe) {
        // Save current scroll position before iframe loads
        const currentScroll = window.scrollY;

        // Restore scroll position if iframe tries to scroll the page
        const scrollHandler = () => {
            if (window.scrollY !== currentScroll) {
                window.scrollTo(0, currentScroll);
            }
        };

        // Listen for scroll events during iframe load
        window.addEventListener('scroll', scrollHandler, true);

        // Stop listening after iframe has fully loaded
        setTimeout(() => {
            window.removeEventListener('scroll', scrollHandler, true);
            console.log("Botpress iframe loaded - scroll listener removed");
        }, 2000);
    }
});

// Prevent Botpress from auto-scrolling page on load
window.addEventListener('load', () => {
    // Restore user's scroll position after iframes try to scroll
    const scrollY = sessionStorage.getItem('scrollY');
    if (scrollY !== null && sessionStorage.getItem('pageLoadCount') === '1') {
        window.scrollTo(0, parseInt(scrollY));
        sessionStorage.removeItem('scrollY');
        sessionStorage.removeItem('pageLoadCount');
    }
}, { passive: false });

// Save scroll position before page navigation
window.addEventListener('beforeunload', () => {
    sessionStorage.setItem('scrollY', window.scrollY.toString());
    sessionStorage.setItem('pageLoadCount', '1');
});

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

// ========================================
// FLOWISE REFRESH BUTTON FUNCTIONALITY
// ========================================
document.addEventListener('DOMContentLoaded', () => {
    const refreshBtn = document.getElementById('flowise-refresh-btn');

    if (refreshBtn) {
        refreshBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();

            console.log("Refresh button clicked");

            // Save current scroll position before reload
            sessionStorage.setItem('scrollY', window.scrollY.toString());
            sessionStorage.setItem('pageLoadCount', '1');

            // Clear localStorage to reset Flowise chat
            Object.keys(localStorage).forEach(key => {
                localStorage.removeItem(key);
            });

            // Clear IndexedDB (Flowise uses this for persistence)
            if (window.indexedDB) {
                window.indexedDB.databases().then(databases => {
                    databases.forEach(db => {
                        window.indexedDB.deleteDatabase(db.name);
                        console.log(`Deleted IndexedDB: ${db.name}`);
                    });
                }).catch(err => {
                    console.log("Error clearing IndexedDB:", err);
                });
            }

            // Wait a moment for storage clearing, then reload
            setTimeout(() => {
                window.location.reload();
            }, 300);
        });
    }
});

