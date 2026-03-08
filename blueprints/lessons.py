from flask import Blueprint, render_template, session, redirect, url_for, jsonify
from services.content import ContentService

lessons_bp = Blueprint('lessons', __name__)
content = ContentService()


@lessons_bp.route('/dashboard')
def dashboard():
    """Learning dashboard with lesson cards and progress."""
    user_name = session.get('user_name')
    if not user_name:
        return redirect(url_for('main.index'))

    user_goals = session.get('user_goals', [])
    all_lessons = content.get_all_lessons()

    return render_template(
        'dashboard.html',
        user_name=user_name,
        user_goals=user_goals,
        lessons=all_lessons,
    )


@lessons_bp.route('/lesson/<lesson_id>')
def lesson(lesson_id):
    """Individual lesson page with theory, examples, and demo."""
    user_name = session.get('user_name')
    if not user_name:
        return redirect(url_for('main.index'))

    lesson_data = content.get_lesson(lesson_id)
    if not lesson_data:
        return redirect(url_for('lessons.dashboard'))

    # Get prev/next for navigation
    all_lessons = content.get_all_lessons()
    current_idx = next(
        (i for i, l in enumerate(all_lessons) if l['id'] == lesson_id), 0
    )
    prev_lesson = all_lessons[current_idx - 1] if current_idx > 0 else None
    next_lesson = (
        all_lessons[current_idx + 1] if current_idx < len(all_lessons) - 1 else None
    )

    return render_template(
        'lesson.html',
        lesson=lesson_data,
        prev_lesson=prev_lesson,
        next_lesson=next_lesson,
        user_name=user_name,
    )


@lessons_bp.route('/api/lessons')
def api_lessons():
    """JSON endpoint for all lesson metadata (used by JS progress tracking)."""
    lessons = content.get_all_lessons()
    return jsonify([
        {
            'id': l['id'],
            'owasp_id': l['owasp_id'],
            'title': l['title'],
            'difficulty': l['difficulty'],
            'duration_min': l['duration_min'],
        }
        for l in lessons
    ])
