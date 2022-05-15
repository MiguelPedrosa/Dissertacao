#!/usr/bin/env node

const { spawnSync }= require("child_process");

// const kernels = [ "3mm", "floyd-marshall", "gemm", "jacobi-1d", "jacobi-2d", "memcpy", "saxpy", "trisolv" ];
const kernels = [ "test" ];
const compileFlags = [ "-Wall", "-pedantic", "-DTYPE=1", "-DSIZE=64" ];
const linkFlags = [ "-Wall", "-pedantic", "-static" ];
const compilerPath = "/home/miguel/diss/sources/install/uve_tc/bin/riscv64-unknown-elf-gcc";
const pkPath = "/home/miguel/diss/tools/riscv64-unknown-elf/bin/pk";
const spikePath = "/home/miguel/diss/tools/bin/spike";
const bin_simple = "./run_simple";
const bin_clava = "./run_clava";


function executableRun(command, args) {
  const executable = spawnSync(command, args);
  if (executable.error) {
    throw new Error(`An error occured while trying to run ${command}: ${executable.error.message}`);
  }
  if (executable.status != 0) {
    throw new Error(`Issue in executable ${command} [${args.join(' ')}]: Execution failed\nStderr: ${executable.stderr}\nStdout: ${executable.stdout}`);
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

function aproximateEqual(stdout1, stdout2) {
  const str1 = stdout1.split("\n");
  const str2 = stdout2.split("\n");
  if (str1.length !== str2.length) {
    console.log(`Tests did not generate same amount of values`);
    return false;
  }

  for (let i = 0; i < str1.length; i++) {
    const value1 = parseFloat(str1[i]);
    const value2 = parseFloat(str2[i]);

    const diff = Math.abs(value1 - value2);
    if (diff > 0.0001) {
      console.error(`Values were ${str1[i]} and ${str2[i]} with difference of ${diff} at index ${i}`);
      return false;
    }
  }

  return true;
}


for (let kernel of kernels) {
  /* Compile commun source files */
  compileKernel(compilerPath, [...compileFlags, "-O3", "benchmarks/Commun.c", "-c"]);
  compileKernel(compilerPath, [...compileFlags, "-O3", "-Ibenchmarks/", `benchmarks/${kernel}/main.c`, "-c"]);
  /* Compile and link each kernel file */
  compileKernel(compilerPath, [...compileFlags, "-DRUN_SIMPLE", "-Ibenchmarks/", "-O0", `benchmarks/${kernel}/kernel.c`, "-c" ]);
  compileKernel(compilerPath, [...linkFlags, "-O0", "Commun.o", `kernel.o`, `main.o`, "-o", bin_simple]);

  executableRun("clava", ["Transform.lara", "-i", "src-lara", `--argv=kernelName:'${kernel}', compFlags:'${compileFlags.join(' ')}'`]);
  compileKernel(compilerPath, [...compileFlags, "-Ibenchmarks/", "-O0", `output/${kernel}/kernel.c`, "-c" ]);
  compileKernel(compilerPath, [...linkFlags, "-O0", "Commun.o", `kernel.o`, `main.o`, "-o", bin_clava]);

  /* Run each kernel file */
  const execSimple = executableRun(spikePath, [pkPath, bin_simple]);
  const execClava = executableRun(spikePath, [pkPath, bin_clava]);

  /* Test if generated values are similar */
  if (aproximateEqual(execSimple.stdout.toString(), execClava.stdout.toString())) {
    console.log(`Kernel ${kernel} is similar enough`);
  } else {
    console.error(`Kernel ${kernel}: Did not generate result similar enough`);
    break;
  }

  /* Delete executables for next kernel */
  const del = spawnSync("rm", ["-rf", bin_simple, bin_clava, 'woven_code', `main.o`, `kernel.o`, `Commun.o`]);
  if (del.error) {
    console.error(`Kernel ${kernel}: An error occured while deleting files for next execution: ${del.error.message}`);
    break;
  }
}
