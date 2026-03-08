from flask import Flask
from dotenv import load_dotenv
from config import Config

load_dotenv()


def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

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
