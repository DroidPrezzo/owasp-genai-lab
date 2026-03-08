from flask import Blueprint, render_template, request, redirect, url_for, session

main_bp = Blueprint('main', __name__)


@main_bp.route('/')
def index():
    """Landing page — show onboarding if no session, else redirect to dashboard."""
    if session.get('user_name'):
        return redirect(url_for('lessons.dashboard'))
    return render_template('onboarding.html')


@main_bp.route('/onboard', methods=['POST'])
def onboard():
    """Process onboarding form — save name and goals to session."""
    name = request.form.get('name', '').strip()
    goals = request.form.getlist('goals')

    if not name:
        return redirect(url_for('main.index'))

    session['user_name'] = name
    session['user_goals'] = goals
    return redirect(url_for('lessons.dashboard'))


@main_bp.route('/reset')
def reset():
    """Clear session and return to onboarding."""
    session.clear()
    return redirect(url_for('main.index'))
