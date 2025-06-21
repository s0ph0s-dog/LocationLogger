#!/bin/sh

INPUT="$1"
SIZES="512
384
192
152
144
128
96
72"

INPUT_FILENAME="${INPUT%.*}"
INPUT_EXT="${INPUT#*.}"

for size in $SIZES; do
  dimensions="${size}x${size}"
  outfile="$INPUT_FILENAME-${dimensions}.$INPUT_EXT"
  magick "$INPUT" -resize "$dimensions\>" "$outfile"
  pngcrush -new -ow "$outfile"
done
