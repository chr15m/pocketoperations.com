#!/usr/bin/env python3
import os
import sys
import re

# Ensure we can import po_tools from the same directory
sys.path.append(os.path.dirname(__file__))
from po_tools import check_url

# Regex to extract HTTP/HTTPS URLs
URL_REGEX = re.compile(r'https?://[^\s\)\"\'\>]+')

def main():
    urls_to_check = {}  # url -> set of files containing it

    # 1. Scan markdown pages
    if os.path.exists("pages"):
        for root, _, files in os.walk("pages"):
            for file in files:
                if file.endswith(".md"):
                    path = os.path.join(root, file)
                    with open(path, "r", encoding="utf-8") as f:
                        for url in URL_REGEX.findall(f.read()):
                            url = url.rstrip('.,;)]"\'><')
                            urls_to_check.setdefault(url, set()).add(path)

    # 2. Scan index.html
    if os.path.exists("index.html"):
        with open("index.html", "r", encoding="utf-8") as f:
            for url in URL_REGEX.findall(f.read()):
                url = url.rstrip('.,;)]"\'><')
                urls_to_check.setdefault(url, set()).add("index.html")

    broken_links = []
    for url, sources in sorted(urls_to_check.items()):
        # Skip internal domain references
        if "pocketoperations.com" in url:
            continue

        res = check_url(url)
        if not res["online"]:
            # Etsy/Instagram/etc. might return 403 to scrapers, but are usually fine
            if res["status"] == 403:
                continue
            
            broken_links.append((url, sources, res.get('error') or res.get('status')))

    # Output summary for the LLM
    if broken_links:
        print("=== BROKEN LINKS REPORT ===")
        for url, sources, err in broken_links:
            print(f"- URL: {url}")
            print(f"  Files: {', '.join(sources)}")
            print(f"  Reason: {err}")
            print()
    else:
        print("No broken links found.")

if __name__ == "__main__":
    main()
