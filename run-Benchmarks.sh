#!/usr/bin/env bash

CMD="clava Launcher.lara -i src-lara -b 2"
ERR_FILE="err.txt"

${CMD} 2> "$ERR_FILE"

# If error file is empty, delete it
[[ ! -s "$ERR_FILE" ]] && rm "$ERR_FILE"

# Removed temporary folder
rm -rf "woven_code"