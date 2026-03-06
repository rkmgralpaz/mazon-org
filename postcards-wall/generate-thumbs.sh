#!/bin/bash
# generate-thumbs.sh
# Generates thumbnail (466px wide, q75) and LQIP (20px wide, q20) versions
# of all postcard images (Selects + Front).
# Requires: cwebp (brew install webp)

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
POSTCARDS_DIR="$SCRIPT_DIR/postcards"

# Settings
THUMB_WIDTH=466
THUMB_QUALITY=75
LQIP_WIDTH=20
LQIP_QUALITY=20

process_folder() {
    local src_dir="$1"
    local thumb_dir="$src_dir/thumbs"
    local lqip_dir="$src_dir/lqip"

    mkdir -p "$thumb_dir" "$lqip_dir"

    for file in "$src_dir"/*.webp; do
        [ -f "$file" ] || continue
        local name=$(basename "$file")

        # Thumbnail
        if [ ! -f "$thumb_dir/$name" ] || [ "$file" -nt "$thumb_dir/$name" ]; then
            echo "  thumb: $name"
            cwebp -resize "$THUMB_WIDTH" 0 -q "$THUMB_QUALITY" "$file" -o "$thumb_dir/$name" 2>/dev/null
        fi

        # LQIP
        if [ ! -f "$lqip_dir/$name" ] || [ "$file" -nt "$lqip_dir/$name" ]; then
            echo "  lqip:  $name"
            cwebp -resize "$LQIP_WIDTH" 0 -q "$LQIP_QUALITY" "$file" -o "$lqip_dir/$name" 2>/dev/null
        fi
    done
}

echo "=== Generating Selects thumbs + LQIP ==="
process_folder "$POSTCARDS_DIR/Selects"

echo "=== Generating Front thumbs + LQIP ==="
process_folder "$POSTCARDS_DIR/Front"

echo "=== Done ==="
echo "Selects thumbs: $(ls "$POSTCARDS_DIR/Selects/thumbs/" 2>/dev/null | wc -l | tr -d ' ') files"
echo "Selects lqip:   $(ls "$POSTCARDS_DIR/Selects/lqip/" 2>/dev/null | wc -l | tr -d ' ') files"
echo "Front thumbs:   $(ls "$POSTCARDS_DIR/Front/thumbs/" 2>/dev/null | wc -l | tr -d ' ') files"
echo "Front lqip:     $(ls "$POSTCARDS_DIR/Front/lqip/" 2>/dev/null | wc -l | tr -d ' ') files"
