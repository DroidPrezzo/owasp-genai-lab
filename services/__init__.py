import json
import os

class ContentService:
    """Loads and caches lesson data from lessons.json."""

    def __init__(self):
        data_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'data', 'lessons.json')
        with open(data_path, 'r') as f:
            self._lessons = json.load(f)
        self._index = {lesson['id']: lesson for lesson in self._lessons}

    def get_all_lessons(self):
        return self._lessons

    def get_lesson(self, lesson_id):
        return self._index.get(lesson_id)

    def get_lessons_for_goals(self, goal_ids):
        """Filter lessons that match the user's selected learning goal IDs."""
        if not goal_ids:
            return self._lessons
        return [l for l in self._lessons if l['id'] in goal_ids]
