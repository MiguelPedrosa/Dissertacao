#! /usr/bin/env bash


print_format () {
  echo -e "\nExpected command to be worded as:"
  echo -e "$0 <benchmark-name> <build-uuid>"
}


# Test if all arguments necessary were given
[[ -z $1 ]] && printf "Missing benchmark name\n" && print_format && exit 1
[[ -z $2 ]] && printf "Missing build uuid\n" && print_format && exit 1

# Store arguments for easier reference
BENCHMARK_NAME=$1
BENCHMARK_UUID=$2

# Find directories to store values in
ROOT_DIR="$(dirname $(realpath $0))/.." # base directory for results folder (scripts, values, etc.)
VALUES_DIR="$ROOT_DIR/values"
BENCHMARK_DIR="$VALUES_DIR/$BENCHMARK_NAME"
BUILD_DIR="$BENCHMARK_DIR/builds/$BENCHMARK_UUID"

# Build directories if they don't exist
[[ -d "$VALUES_DIR" ]]    || mkdir -p "$VALUES_DIR"
[[ -d "$BENCHMARK_DIR" ]] || mkdir -p "$BENCHMARK_DIR"
[[ -d "$BUILD_DIR" ]]     || mkdir -p "$BUILD_DIR"

# Fetch all files of the given array size and architecture
# We use 2 for loop to have better control of the output files
# TODO: Use general cartisian formula instead, so that each benchmark can have ...
# project specific configuration.
# TODO: Add count total count of files copied to output
for arch in "rv" "sts" "uve"; do
  for size in 2048 4096 8192 16384 32768; do
    SRC="/home/mhenriques/gem5_benchmarks/scripts/benchmarks/m_$BENCHMARK_NAME/builds/$BENCHMARK_UUID/"$arch"_a76_"$size"/m5out/stats.out"
    DEST="$BUILD_DIR/"$arch"_a76_"$size".out"

    scp "mhenriques@diana.inesc-id.pt:$SRC" "$DEST" || { echo "ERROR: failed to copy file $SRC to $DEST" && exit 2; }
  done
done

# Store build uuids in the order the script was run
# TODO: Store uuids so that topmost value is the most recent
BUILDS_INFO_FILE="$BENCHMARK_DIR/build-id"
[[ ! -f "$BUILDS_INFO_FILE" ]] || touch "$BUILDS_INFO_FILE"
echo "$BENCHMARK_UUID $(date '+%F %T')" >> "$BUILDS_INFO_FILE"


