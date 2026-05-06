#!/usr/bin/env bash

set -euo pipefail

DEFAULT_TARGET="src/assets"

print_help() {
  cat <<'EOF'
Usage:
  ./scripts/convert-fonts.sh [path ...]

Description:
  Convert .otf font files to .woff2 with pyftsubset while keeping the full
  character set.

Arguments:
  path    Optional file or directory. When omitted, the script scans src/assets.

Examples:
  ./scripts/convert-fonts.sh
  ./scripts/convert-fonts.sh src/assets/akrecruit
  ./scripts/convert-fonts.sh src/assets/akrecruit/SourceHanSansSC-Normal.otf
EOF
}

if [[ "${1:-}" == "-h" || "${1:-}" == "--help" ]]; then
  print_help
  exit 0
fi

if ! command -v pyftsubset >/dev/null 2>&1; then
  cat <<'EOF' >&2
Missing dependency: pyftsubset

Install it with:
  pip install fonttools brotli zopfli
EOF
  exit 1
fi

declare -a otf_files=()

collect_files() {
  local target="$1"

  if [[ -f "$target" ]]; then
    if [[ "$target" == *.otf ]]; then
      otf_files+=("$target")
    else
      echo "Skip non-OTF file: $target" >&2
    fi
    return
  fi

  if [[ -d "$target" ]]; then
    while IFS= read -r file; do
      otf_files+=("$file")
    done < <(find "$target" -type f -name "*.otf" | sort)
    return
  fi

  echo "Path not found: $target" >&2
  exit 1
}

if [[ "$#" -eq 0 ]]; then
  collect_files "$DEFAULT_TARGET"
else
  for target in "$@"; do
    collect_files "$target"
  done
fi

if [[ "${#otf_files[@]}" -eq 0 ]]; then
  echo "No .otf files found."
  exit 0
fi

converted_count=0

for font_path in "${otf_files[@]}"; do
  output_path="${font_path%.otf}.woff2"
  echo "Converting $font_path -> $output_path"

  pyftsubset "$font_path" \
    --output-file="$output_path" \
    --flavor=woff2 \
    --unicodes='*'

  converted_count=$((converted_count + 1))
done

echo "Converted $converted_count font(s)."
