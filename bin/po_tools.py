import os

def save_suggestions(content: str):
    """Saves the suggested additions to suggested-additions.md.

    Args:
        content: The full markdown content of the suggestions.
    """
    path = "suggested-additions.md"
    with open(path, "w", encoding="utf-8") as f:
        f.write(content)
    return f"Successfully saved suggestions to {path}"

save_suggestions.safe = True
