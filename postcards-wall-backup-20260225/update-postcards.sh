#!/bin/bash
# ╔════════════════════════════════════════════════════════════════╗
# ║  update-postcards.sh — Gestión automática de postcards        ║
# ╚════════════════════════════════════════════════════════════════╝
#
# Este script hace TODO el trabajo pesado cuando cambian las
# imágenes de postcards: renombra, genera miniaturas y actualiza
# el código automáticamente. No hace falta tocar app.js a mano.
#
# ─────────────────────────────────────────────────────────────────
# REQUISITOS
# ─────────────────────────────────────────────────────────────────
#   - ImageMagick 7+  (brew install imagemagick)
#   - Las imágenes fuente deben ser .webp
#
# ─────────────────────────────────────────────────────────────────
# USO
# ─────────────────────────────────────────────────────────────────
#
#   1) REEMPLAZAR todas las postcards con un set nuevo:
#
#      ./update-postcards.sh /ruta/a/carpeta-con-webps
#
#      Esto:
#        - Borra las postcards actuales (imágenes + thumbs + lqip)
#        - Copia las nuevas y las renombra: postcard-001.webp, 002, 003...
#        - Genera thumbnails (466px) en postcards/Selects/thumbs/
#        - Genera LQIP placeholder (20px) en postcards/Selects/lqip/
#        - Actualiza app.js con la cantidad correcta
#
#   2) REGENERAR thumbs/lqip sin cambiar imágenes:
#
#      ./update-postcards.sh
#
#      Útil si borraste thumbs/lqip por error o agregaste
#      imágenes manualmente a postcards/Selects/.
#      Solo genera los que falten y actualiza el conteo en app.js.
#
# ─────────────────────────────────────────────────────────────────
# ESTRUCTURA DE ARCHIVOS
# ─────────────────────────────────────────────────────────────────
#
#   postcards-wall/
#   ├── app.js                        ← se actualiza automáticamente
#   ├── update-postcards.sh           ← este script
#   └── postcards/
#       └── Selects/
#           ├── postcard-001.webp     ← imágenes full-res
#           ├── postcard-002.webp
#           ├── ...
#           ├── thumbs/
#           │   ├── postcard-001.webp ← 466px de ancho
#           │   └── ...
#           └── lqip/
#               ├── postcard-001.webp ← 20px de ancho (blur placeholder)
#               └── ...
#
# ─────────────────────────────────────────────────────────────────
# EJEMPLO RÁPIDO
# ─────────────────────────────────────────────────────────────────
#
#   # Tengo 40 fotos nuevas en ~/Desktop/nuevas-postcards/
#   cd postcards-wall
#   ./update-postcards.sh ~/Desktop/nuevas-postcards/
#
#   # Listo — app.js ya apunta a 40 postcards, thumbs y lqip creados.
#
# ═════════════════════════════════════════════════════════════════

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
SELECTS_DIR="$SCRIPT_DIR/postcards/Selects"
THUMBS_DIR="$SELECTS_DIR/thumbs"
LQIP_DIR="$SELECTS_DIR/lqip"
APP_JS="$SCRIPT_DIR/app.js"

THUMB_WIDTH=466
LQIP_WIDTH=20

# ── Verificar que ImageMagick está instalado ──
if ! command -v magick &>/dev/null; then
    echo "Error: ImageMagick no está instalado."
    echo "  Instalalo con:  brew install imagemagick"
    exit 1
fi

# ── Si se pasó directorio fuente, importar imágenes ──
if [ "${1:-}" != "" ]; then
    SRC_DIR="$1"
    if [ ! -d "$SRC_DIR" ]; then
        echo "Error: directorio fuente '$SRC_DIR' no existe"
        exit 1
    fi

    echo "→ Limpiando imágenes anteriores..."
    rm -f "$SELECTS_DIR"/postcard-*.webp
    rm -f "$THUMBS_DIR"/postcard-*.webp
    rm -f "$LQIP_DIR"/postcard-*.webp

    echo "→ Copiando y renombrando desde $SRC_DIR..."
    i=1
    for f in "$SRC_DIR"/*.webp; do
        [ -f "$f" ] || continue
        num=$(printf "%03d" $i)
        cp "$f" "$SELECTS_DIR/postcard-${num}.webp"
        i=$((i+1))
    done
    echo "  Copiadas $((i-1)) imágenes"
fi

# ── Contar imágenes existentes ──
COUNT=$(ls -1 "$SELECTS_DIR"/postcard-*.webp 2>/dev/null | wc -l | tr -d ' ')

if [ "$COUNT" -eq 0 ]; then
    echo "Error: no hay imágenes postcard-*.webp en $SELECTS_DIR"
    exit 1
fi

echo "→ $COUNT postcards encontradas"

# ── Crear directorios si no existen ──
mkdir -p "$THUMBS_DIR" "$LQIP_DIR"

# ── Generar thumbs y LQIP (solo los que falten) ──
echo "→ Generando thumbnails (${THUMB_WIDTH}px) y LQIP (${LQIP_WIDTH}px)..."
for f in "$SELECTS_DIR"/postcard-*.webp; do
    name=$(basename "$f")
    if [ ! -f "$THUMBS_DIR/$name" ]; then
        magick "$f" -resize ${THUMB_WIDTH}x "$THUMBS_DIR/$name"
    fi
    if [ ! -f "$LQIP_DIR/$name" ]; then
        magick "$f" -resize ${LQIP_WIDTH}x "$LQIP_DIR/$name"
    fi
done

# ── Actualizar app.js con el conteo correcto ──
echo "→ Actualizando app.js con count=$COUNT..."
sed -i '' "s/for (var i = 1; i <= [0-9]*; i++)/for (var i = 1; i <= $COUNT; i++)/" "$APP_JS"

echo "✓ Listo. $COUNT postcards procesadas con thumbs y LQIP."
