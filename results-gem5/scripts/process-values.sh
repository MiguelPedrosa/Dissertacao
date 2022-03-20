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
CSV_FILE="$ROOT_DIR/values/$BENCHMARK_NAME/$BENCHMARK_NAME.csv"
[[ -f "$CSV_FILE" ]] || touch "$CSV_FILE"

# Print csv header
echo "size,RISC-V,Source-to-Source,UVE" > $CSV_FILE


# Fetch all files of the given array size and architecture
# We use 2 for loop to have better control of the output files
for size in 2048 4096 8192 16384 32768; do
  printf "$size" >> "$CSV_FILE"
  for arch in "rv" "sts" "uve"; do
    CURRENT_FILE="$ROOT_DIR/values/$BENCHMARK_NAME/builds/$BENCHMARK_UUID/"$arch"_a76_"$size".out"
    TICKS=$(awk 'BEGIN {first = 1} { if ($1 == "sim_ticks") { if (first == 1) { first = 0 } else { print $2 } } }' $CURRENT_FILE)
    CLOCK=$(awk 'BEGIN {first = 1} { if ($1 == "system.clk_domain.clock") { if (first == 1) { first = 0 } else { print $2 } } }' $CURRENT_FILE)
    printf ",%f" $(python -c "print ( $TICKS/($CLOCK) )" ) >> "$CSV_FILE"

    [[ -f $CURRENT_FILE ]] || { echo "ERROR: file $CURRENT_FILE does not exist" && exit 2; }
  done
  printf "\n" >> "$CSV_FILE"
done


