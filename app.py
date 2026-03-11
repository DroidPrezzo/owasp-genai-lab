import re
from markupsafe import Markup, escape
from flask import Flask
from dotenv import load_dotenv
from config import Config

load_dotenv()


def _md_inline(text):
    """Convert lightweight markdown (bold, code, list dashes) to HTML."""
    s = escape(text)  # escape HTML entities first
    s = re.sub(r'\*\*(.+?)\*\*', r'<strong>\1</strong>', str(s))
    s = re.sub(r'`(.+?)`', r'<code>\1</code>', s)
    s = s.replace('- ', '<br>• ')
    return Markup(s)


def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    # Custom Jinja2 filter for inline markdown
    app.jinja_env.filters['md_inline'] = _md_inline

    # Register blueprints
    from blueprints import main_bp
    from blueprints.lessons import lessons_bp

    app.register_blueprint(main_bp)
    app.register_blueprint(lessons_bp)

    return app


# For local development: python app.py
if __name__ == '__main__':
    app = create_app()
    app.run(debug=True, port=5000)
