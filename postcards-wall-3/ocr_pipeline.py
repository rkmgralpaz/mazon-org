#!/usr/bin/env python3
"""
OCR Pipeline for Postcard Handwritten Messages
Uses Claude claude-sonnet-4-6 Vision API to extract handwritten text from postcard images.
Outputs postcards-alts.json with extracted text for each image.
"""

import base64
import json
import os
import sys
from pathlib import Path

try:
    import anthropic
except ImportError:
    print("Error: 'anthropic' package not installed. Run: pip install anthropic")
    sys.exit(1)

IMAGES_DIR = Path(__file__).parent / "postcards" / "Selects"
OUTPUT_FILE = Path(__file__).parent / "postcards-alts.json"
MODEL = "claude-sonnet-4-6"

PROMPT = (
    "This is a postcard. Extract ONLY the handwritten message written on the "
    "LEFT side of the image. Ignore completely: printed addresses, stamps, logos, "
    "letterheads, and any printed text on the right side. Return only the handwritten "
    "text as plain text, preserving line breaks. If the handwriting is illegible or "
    "no handwritten text is found, respond with: [ILEGIBLE]"
)


def load_existing():
    """Load existing JSON results for incremental processing."""
    if OUTPUT_FILE.exists():
        try:
            with open(OUTPUT_FILE, "r", encoding="utf-8") as f:
                return json.load(f)
        except (json.JSONDecodeError, IOError):
            print("Warning: Could not read existing JSON, starting fresh.")
    return {}


def save_results(data):
    """Save results to JSON file."""
    with open(OUTPUT_FILE, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)


def process_image(client, image_path):
    """Send a single image to Claude Vision and return extracted text."""
    with open(image_path, "rb") as f:
        image_data = base64.standard_b64encode(f.read()).decode("utf-8")

    response = client.messages.create(
        model=MODEL,
        max_tokens=1024,
        messages=[
            {
                "role": "user",
                "content": [
                    {
                        "type": "image",
                        "source": {
                            "type": "base64",
                            "media_type": "image/webp",
                            "data": image_data,
                        },
                    },
                    {"type": "text", "text": PROMPT},
                ],
            }
        ],
    )

    text = response.content[0].text.strip()
    return text if text else "[ILEGIBLE]"


def main():
    api_key = os.environ.get("ANTHROPIC_API_KEY")
    if not api_key:
        print("Error: ANTHROPIC_API_KEY environment variable not set.")
        sys.exit(1)

    client = anthropic.Anthropic(api_key=api_key)

    # Gather all webp images sorted by name
    if not IMAGES_DIR.exists():
        print(f"Error: Images directory not found: {IMAGES_DIR}")
        sys.exit(1)

    all_images = sorted(IMAGES_DIR.glob("postcard-*.webp"))
    if not all_images:
        print("Error: No postcard-*.webp files found.")
        sys.exit(1)

    # Load existing results for incremental mode
    results = load_existing()
    to_process = [img for img in all_images if img.name not in results]

    total = len(all_images)
    skipped = total - len(to_process)

    if skipped > 0:
        print(f"Incremental mode: {skipped} already processed, {len(to_process)} remaining.")

    if not to_process:
        print("All images already processed. Nothing to do.")
        return

    successful = 0
    illegible = 0
    errors = 0

    for i, image_path in enumerate(to_process, 1):
        num = image_path.stem.replace("postcard-", "")
        label = f"{i:03d}/{len(to_process):03d}: {image_path.name}"

        try:
            text = process_image(client, image_path)
            results[image_path.name] = text

            if text == "[ILEGIBLE]":
                illegible += 1
                print(f"Processing {label}... ILLEGIBLE")
            else:
                successful += 1
                print(f"Processing {label}... OK")

            # Save after each image to preserve progress
            save_results(results)

        except Exception as e:
            errors += 1
            print(f"Processing {label}... ERROR: {e}")

    print(f"\n--- Summary ---")
    print(f"Processed: {len(to_process)}")
    print(f"Successful: {successful}")
    print(f"Illegible: {illegible}")
    print(f"Errors: {errors}")
    print(f"Total in JSON: {len(results)}")


if __name__ == "__main__":
    main()
