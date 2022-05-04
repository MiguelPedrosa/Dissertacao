#!/usr/bin/env node
const { spawnSync }= require("child_process");


const kernels = [ "memcpy", "saxpy" ];
// const kernels = [ "saxpy" ];
const compileFlags = [ "-Wall", "-pedantic", "-static", "-DTYPE=1" ];

const compilerPath = "/home/miguel/diss/sources/install/uve_tc/bin/riscv64-unknown-elf-gcc";
const pkPath = "/home/miguel/diss/tools/riscv64-unknown-elf/bin/pk";
const spikePath = "/home/miguel/diss/tools/bin/spike";
const bin_simple = "./run_simple";
const bin_uve = "./run_uve";


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
  /* Generate binary without UVE */
  const comp1 = spawnSync(compilerPath, [...compileFlags, `${kernel}.c`, "-o", bin_simple]);
  if (comp1.error) {
    console.error(`Kernel ${kernel}: An error occured while trying to compile without UVE: ${comp1.error.message}`);
    break;
  }
  if (comp1.status != 0) {
    console.error(`Kernel ${kernel}: Compilation without UVE failed: ${comp1.stderr}`);
    break;
  }
  /* Generate binary with UVE */
  const comp2 = spawnSync(compilerPath, [...compileFlags, "-DUVE_RUN", `${kernel}.c`, "-o", bin_uve]);
  if (comp2.error) {
    console.error(`Kernel ${kernel}: An error occured while trying to compile with UVE: ${comp2.error.message}`);
    break;
  }
  if (comp2.status != 0) {
    console.error(`Kernel ${kernel}: Compilation with UVE failed: ${comp2.stderr}`);
    break;
  }

  /* Run binary without UVE */
  const exec1 = spawnSync(spikePath, [pkPath, bin_simple]);
  if (exec1.error) {
    console.error(`Kernel ${kernel}: An error occured while trying to run without UVE: ${exec1.error.message}`);
    break;
  }
  if (exec1.status != 0) {
    console.error(`Kernel ${kernel}: Execution without UVE failed: ${exec1.stderr}`);
    break;
  }
  /* Run binary with UVE */
  const exec2 = spawnSync(spikePath, [pkPath, bin_uve]);
  if (exec2.error) {
    console.error(`Kernel ${kernel}: An error occured while trying to run with UVE: ${exec2.error.message}`);
    break;
  }
  if (exec2.status != 0) {
    console.error(`Issue in Kernel ${kernel}: Execution with UVE failed.`)
    console.error(`Stderr: ${exec2.stderr}`);
    console.error(`Stdout: ${exec2.stdout}`);
    break;
  }

  /* Test if generated values are similar */
  if (aproximateEqual(exec1.stdout.toString(), exec2.stdout.toString())) {
    console.log(`Kernel ${kernel} is similar enough`);
  } else {
    console.error(`Kernel ${kernel}: Did not generate result similar enough`);
    break;
  }

  /* Delete executables for next kernel */
  const del = spawnSync("rm", ["-f", bin_simple, bin_uve]);
  if (del.error) {
    console.error(`Kernel ${kernel}: An error occured while deleting files for next execution: ${del.error.message}`);
    break;
  }
}
