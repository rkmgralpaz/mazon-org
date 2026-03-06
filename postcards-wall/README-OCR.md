# Postcard OCR Pipeline

Extracts handwritten messages from postcard images using Claude Vision API and injects them as alt text.

## Prerequisites

- Python 3.8+
- `pip install anthropic`
- `ANTHROPIC_API_KEY` environment variable set

## Files

| File | Purpose |
|------|---------|
| `ocr_pipeline.py` | Reads postcard images, sends to Claude Vision, outputs `postcards-alts.json` |
| `inject_alts.py` | Creates `postcards-alts-data.js` and patches `app.js` / `index.html` |
| `postcards-alts.json` | Extracted text per image (generated) |
| `postcards-alts-data.js` | JS variable with alt data (generated) |

## Usage

### First Run

```bash
export ANTHROPIC_API_KEY="sk-ant-..."
python ocr_pipeline.py
python inject_alts.py
```

### Incremental Run (new images only)

Just run `ocr_pipeline.py` again — it skips images already in the JSON.

### Full Reprocess

Delete the JSON and run again:

```bash
rm postcards-alts.json
python ocr_pipeline.py
python inject_alts.py
```

## Troubleshooting

- **"ANTHROPIC_API_KEY not set"** — Export the key: `export ANTHROPIC_API_KEY="sk-ant-..."`
- **API errors on specific images** — Re-run; incremental mode will retry only failed ones.
- **Wrong alt text** — Edit `postcards-alts.json` manually, then re-run `inject_alts.py`.
- **Revert app.js changes** — The original patterns are `'Postcard ' + (index + 1)`. Restore from version control.
