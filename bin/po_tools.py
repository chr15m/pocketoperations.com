import os
import urllib.request
import urllib.error

def check_url(url: str) -> dict:
    """Checks if a URL is online and returns its status.

    Args:
        url: The URL to check.
    """
    req = urllib.request.Request(
        url,
        headers={"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"}
    )
    try:
        with urllib.request.urlopen(req, timeout=10) as resp:
            return {"status": resp.status, "online": True, "url": url}
    except urllib.error.HTTPError as e:
        return {"status": e.code, "online": False, "error": str(e), "url": url}
    except Exception as e:
        return {"status": None, "online": False, "error": str(e), "url": url}

check_url.safe = True


def download_image(url: str, filename: str) -> str:
    """Downloads an image from a URL and saves it to img/content/.

    Args:
        url: The direct image URL to download.
        filename: The target filename (e.g., 'my-case.jpg').
    """
    safe_name = os.path.basename(filename)
    target_path = os.path.join("img", "content", safe_name)

    warning = ""
    if os.path.exists(target_path):
        warning = f"WARNING: Overwriting existing file at {target_path}. "

    req = urllib.request.Request(
        url,
        headers={"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"}
    )
    try:
        with urllib.request.urlopen(req, timeout=15) as resp:
            data = resp.read()
            os.makedirs(os.path.dirname(target_path), exist_ok=True)
            with open(target_path, "wb") as f:
                f.write(data)
            return f"{warning}Successfully downloaded image to {target_path}"
    except Exception as e:
        return f"Error downloading image: {str(e)}"

download_image.safe = True


def write_page(filename: str, content: str) -> str:
    """Writes or updates a markdown page in the pages/ directory.

    Args:
        filename: The filename in pages/ (e.g., 'pocket-operator-cases.md').
        content: The full markdown content of the page.
    """
    safe_name = os.path.basename(filename)
    target_path = os.path.join("pages", safe_name)

    try:
        os.makedirs(os.path.dirname(target_path), exist_ok=True)
        with open(target_path, "w", encoding="utf-8") as f:
            f.write(content)
        return f"Successfully wrote page to {target_path}"
    except Exception as e:
        return f"Error writing page: {str(e)}"

write_page.safe = True
