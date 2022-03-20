#! /usr/bin/env node
const { readFileSync } = require('fs');

const benchs = ["3mm", "floyd_warshall", "gemver", "irsmk", "jacobi-1d", "knn", "mamr_diag", "memcpy", "saxpy", "seidel-2d", "test", "covariance", "gemm", "haccmk", "irsmk_new", "jacobi-2d", "mamr", "mamr_ind", "mvt", "saxpy_new", "stream", "trisolv"];

const instructions = new Map();

benchs.forEach(bench => {
  const filename = `../UVE-kernels/${bench}.c`;
  const data = readFileSync(filename);

  const lines = data.toString().split("\n");
  lines.forEach((line, lineIdx) => {
    try {
      const re = /s[a-z]\.[0-9\.a-z]+/;
      const match = line.match(re);

      if (match != null) {
        const instruction = match[0];
        const exists = instructions.has(instruction);
        // Add benchmarks's name to outer Map
        const insMap = exists ? instructions.get(instruction) : new Map();

        // Add benchmark's line to inner Map
        const benchLines = insMap.has(bench) ? insMap.get(bench) : new Array();
        benchLines.push(`#L${lineIdx}`);
        insMap.set(bench, benchLines);

        // Add benchmarks's name to outer Map
        instructions.set(instruction, insMap);
      }
    } catch (error) {
      console.log(`ERROR: while reading file ${bench}`);
    }
  });
  
});



instructions.forEach((insMap, insName) => {
  const instBenchs = [];
  insMap.forEach((benchLines, benchName) => {
    instBenchs.push(`${benchName}: ${benchLines.join(', ')}`)
  });
  console.log(`- [ ] ${insName}: \n\t\t* ${instBenchs.join('\n\t\t* ')}`)
});

