#!/usr/bin/env node

const { spawnSync }= require("child_process");

const kernels = [ "memcpy", "saxpy" ];
const compileFlags = [ "-Wall", "-pedantic", "-DTYPE=1", "-DSIZE=2048" ];
const linkFlags = [ "-Wall", "-pedantic", "-static" ];
const compilerPath = "/home/miguel/diss/sources/install/uve_tc/bin/riscv64-unknown-elf-gcc";
const pkPath = "/home/miguel/diss/tools/riscv64-unknown-elf/bin/pk";
const spikePath = "/home/miguel/diss/tools/bin/spike";
const bin_blank = "./run_blank";
const bin_simple = "./run_simple";
const bin_uve = "./run_uve";

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

function processInstructions(insBlank, insSimple, insUVE) {
  const strippedUVE = insUVE - insBlank;
  const strippedSimple = insSimple - insBlank;

  return {
    "Blank": insBlank,
    "Simple": insSimple,
    "UVE": insUVE,
    "Simple (stripped)": strippedSimple,
    "UVE (stripped)": strippedUVE,
    "Stripped Comparison (UVE/Simple)": strippedUVE / strippedSimple,
  };
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
  /* Compile commun source files */
  compileKernel(compilerPath, [...compileFlags, "-O3", "src/Commun.c", "-c"]);
  compileKernel(compilerPath, [...compileFlags, "-O3", `src/${kernel}_main.c`, "-c"]);
  /* Compile and link each kernel file */
  compileKernel(compilerPath, [...compileFlags, "-DRUN_BLANK", "-O0", `src/${kernel}_kernel.c`, "-c" ]);
  compileKernel(compilerPath, [...linkFlags, "-O0", "Commun.o", `${kernel}_main.o`, `${kernel}_kernel.o`, "-o", bin_blank]);

  compileKernel(compilerPath, [...compileFlags, "-DRUN_SIMPLE", "-O0", `src/${kernel}_kernel.c`, "-c" ]);
  compileKernel(compilerPath, [...linkFlags, "-O0", "Commun.o", `${kernel}_main.o`, `${kernel}_kernel.o`, "-o", bin_simple]);

  compileKernel(compilerPath, [...compileFlags, "-DRUN_UVE", "-O0", `src/${kernel}_kernel.c`, "-c" ]);
  compileKernel(compilerPath, [...linkFlags, "-O0", "Commun.o", `${kernel}_main.o`, `${kernel}_kernel.o`, "-o", bin_uve]);

  /* Run each kernel file */
  const execBlank = executableRun(spikePath, [pkPath, "-s", bin_blank]);
  const execSimple = executableRun(spikePath, [pkPath, "-s", bin_simple]);
  const execUVE = executableRun(spikePath, [pkPath, "-s", bin_uve]);


  /* Extract instructions used during execution of both binaries */
  const insBlank = processBinRun(execBlank.stdout.toString());
  const insSimple = processBinRun(execSimple.stdout.toString());
  const insUVE = processBinRun(execUVE.stdout.toString());

  /* Extract and store kernel information to output later if all kernels pass */
  const blank = parseInt(insBlank);
  const simple = parseInt(insSimple);
  const uve = parseInt(insUVE);
  const key = kernel.toUpperCase();
  instructions[key] = processInstructions(blank, simple, uve);

  /* Delete executables for next kernel */
  const del = spawnSync("rm", ["-f", bin_blank, bin_simple, bin_uve, `${kernel}_main.o`, `${kernel}_kernel.o`, `Commun.o`]);
  if (del.error) {
    console.error(`Kernel ${kernel}: An error occured while deleting files for next execution: ${del.error.message}`);
    break;
  }
}

console.table(instructions);