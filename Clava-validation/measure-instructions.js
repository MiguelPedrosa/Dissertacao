#!/usr/bin/env node
const { spawnSync }= require("child_process");


const kernels = [ "memcpy", "saxpy" ];
const compileFlags = [ "-Wall", "-pedantic", "-static", "-DTYPE=1", "-O0" ];

const compilerPath = "/home/miguel/diss/sources/install/uve_tc/bin/riscv64-unknown-elf-gcc";
const pkPath = "/home/miguel/diss/tools/riscv64-unknown-elf/bin/pk";
const spikePath = "/home/miguel/diss/tools/bin/spike";
const bin_simple = "./simple_run";
const bin_uve = "./uve_run";


const instructions = {};


function executableRun(command, args) {
  const executable = spawnSync(command, args);
  if (executable.error) {
    throw new Error(`An error occured while trying to run ${command}: ${executable.error.message}`);
  }
  if (executable.status != 0) {
    throw new Error(`Issue in Kernel ${command}: Execution failed\nStderr: ${executable.stderr}\nStdout: ${executable.stdout}`);
  }
  return executable;
}

function compileKernel(command, args) {
  const executable = spawnSync(command, args);
  if (executable.error) {
    throw new Error(`An error occured while trying to compile ${command}: ${executable.error.message}`);
  }
  if (executable.status != 0) {
    throw new Error(`Issue in Kernel ${command}: Compilation failed\nStderr: ${executable.stderr}\nStdout: ${executable.stdout}`);
  }
}

function processBinRun(string) {
  const lines = string.split("\n");
  for (let line of lines) {
    const values = line.split(" ");
    if (values[1] === "instructions") {
      return values[0];
    }
  }
  console.error("Missing instructions tag in output");
  return null;
}


for (let kernel of kernels) {
  /* Compile both binaries */
  compileKernel(compilerPath, [...compileFlags, `${kernel}.c`, "-o", bin_simple]);
  compileKernel(compilerPath, [...compileFlags, "-DUVE_RUN", `${kernel}.c`, "-o", bin_uve]);

  /* Run both binaries */
  const exec1 = executableRun(spikePath, [pkPath, "-s", bin_simple]);
  const exec2 = executableRun(spikePath, [pkPath, "-s", bin_uve]);

  /* Extract instructions used during execution of both binaries */
  const ins1 = processBinRun(exec1.stdout.toString());
  const ins2 = processBinRun(exec2.stdout.toString());

  /* Extract and store kernel information to output later if all kernels pass */
  const simple = parseInt(ins1);
  const uve = parseInt(ins2);
  instructions[kernel.toUpperCase()] = {
    simple,
    uve,
    "difference (simple - uve)": simple - uve,
  };

  /* Delete executables for next kernel */
  const del = spawnSync("rm", ["-f", bin_simple, bin_uve]);
  if (del.error) {
    console.error(`Kernel ${kernel}: An error occured while deleting files for next execution: ${del.error.message}`);
    break;
  }
}

console.table(instructions);