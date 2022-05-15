#!/usr/bin/env bash

ERR_FILE="err.txt"

[[ -z $1 ]] && echo "Did not give a benchmark name to execute as argument" && exit 1
[[ ! -d "./benchmarks/$1" ]] && echo "Given directory '$1' does not exist in ./benchmarks" && exit 1

compFlags="-Wall -pedantic -DTYPE=1 -DSIZE=64"

clava "Transform.lara" "-i" "src-lara" "-b" "2" "--argv=kernelName: '$1', compFlags:'$compFlags'" 2> "$ERR_FILE"

# If error file is empty, delete it
[[ ! -s "$ERR_FILE" ]] && rm "$ERR_FILE"

# Removed temporary folder
rm -rf "woven_code" 