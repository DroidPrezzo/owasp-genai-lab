/**
 * progress.js — Lesson progress tracking via localStorage
 */

const PROGRESS_KEY = 'owasp_genai_lab_progress';

/**
 * Get all progress data.
 */
function getProgress() {
    try {
        return JSON.parse(localStorage.getItem(PROGRESS_KEY)) || {};
    } catch {
        return {};
    }
}

/**
 * Mark a lesson as complete.
 */
function markComplete(lessonId) {
    const progress = getProgress();
    progress[lessonId] = {
        completed: true,
        completedAt: new Date().toISOString(),
    };
    localStorage.setItem(PROGRESS_KEY, JSON.stringify(progress));

    // Update the button
    const btn = document.getElementById('completeBtn');
    if (btn) {
        btn.innerHTML = '<span class="material-symbols-outlined">check_circle</span> Completed!';
        btn.classList.remove('btn--filled');
        btn.classList.add('btn--tonal');
        btn.disabled = true;
    }
}

/**
 * Update dashboard progress bar and lesson card indicators.
 */
function updateDashboardProgress(totalLessons) {
    const progress = getProgress();
    const completedCount = Object.values(progress).filter(p => p.completed).length;
    const percentage = totalLessons > 0 ? (completedCount / totalLessons) * 100 : 0;

    // Update progress bar
    const bar = document.getElementById('progressBar');
    if (bar) {
        // Delay for animation effect
        setTimeout(() => {
            bar.style.width = `${percentage}%`;
        }, 200);
    }

    // Update count text
    const count = document.getElementById('progressCount');
    if (count) {
        count.textContent = `${completedCount} / ${totalLessons} completed`;
    }

    // Update individual lesson card progress bars
    document.querySelectorAll('[data-lesson-progress]').forEach(el => {
        const lessonId = el.dataset.lessonProgress;
        if (progress[lessonId] && progress[lessonId].completed) {
            setTimeout(() => {
                el.style.width = '100%';
                el.style.background = 'var(--md-sys-color-tertiary)';
            }, 400);
        }
    });
}

/**
 * Check if a lesson is complete and update the "Mark Complete" button.
 */
function checkLessonComplete(lessonId) {
    const progress = getProgress();
    if (progress[lessonId] && progress[lessonId].completed) {
        const btn = document.getElementById('completeBtn');
        if (btn) {
            btn.innerHTML = '<span class="material-symbols-outlined">check_circle</span> Completed!';
            btn.classList.remove('btn--filled');
            btn.classList.add('btn--tonal');
            btn.disabled = true;
        }
    }
}

// Auto-check lesson completion on lesson pages
(function () {
    const btn = document.getElementById('completeBtn');
    if (btn) {
        const lessonId = btn.getAttribute('onclick')?.match(/'([^']+)'/)?.[1];
        if (lessonId) checkLessonComplete(lessonId);
    }
})();
