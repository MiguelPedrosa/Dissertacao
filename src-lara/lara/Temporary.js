
Temporary.extractAccesses = extractAccesses;


function extractAccesses($loop) {
  const $accesses = Query.searchFrom($loop, "arrayAccess").get();

  let count = 0;
  for (let $access of $accesses) {
    extractSingleAccess($access, '_tmp_' + count, 'u' + count);
    count++;
  }
}

function readASM(dest, src) {
  // Build array from u0 to u31 strings
  const possibleRegisters = [...Array(32).keys()].map(elem => `u${elem}`);
  if (!possibleRegisters.includes(src)) throw new Error(`Trying to use a vector register not allowed: ${src}`);

  return `so.v.mvvs ${dest}, ${src}`;
}

function writeASM(dest, src, width) {
  // Build array from u0 to u31 strings
  const possibleRegisters = [...Array(32).keys()].map(elem => `u${elem}`);
  if (!possibleRegisters.includes(dest)) throw new Error(`Trying to use a vector register not allowed: ${dest}`);
  // Check if widths are acceptable
  if (!['b', 'h', 'w', 'd'].includes(width)) throw new Error(`Trying to use a width not allowed: ${width}`);

  return `so.v.mvsv.${width} ${dest}, ${src}`;
}

function asmTemplate(operations, outputOperands, inputOperands) {
  const opLiteral = operations.map(op => `"${op}"`).join(' \\t\\n\n');
  const inLiteral = Object.entries(inputOperands).map( ([key, value]) => `[${key}] "r" (${value})`).join(',');
  const outLiteral = Object.entries(outputOperands).map( ([key, value]) => `[${key}] "=r" (${value})`).join(',');
  return `asm volatile(
\t${opLiteral}
\t: ${outLiteral}
\t: ${inLiteral}
);`;
}

function extractSingleAccess($arrayAccess, newName, regName) {

  const isWrite = $arrayAccess.use === 'write';
  const type = $arrayAccess.type;
  // Create new variable using content of array access
  const $newVarDecl = ClavaJoinPoints.varDeclNoInit(newName, type);
  $arrayAccess.insertBefore($newVarDecl);

  if (isWrite) {
    const widthMapping = {
      1 : 'b',
      2 : 'h',
      4 : 'w',
      8 : 'd',
    }
    const width = widthMapping[$arrayAccess.bitWidth / 8];
    const asmOperations = [writeASM(regName, '%[x]', width) ];
    const outputOperands = {
      'x': newName,
    };
    const asmLiteral = asmTemplate(asmOperations, {}, outputOperands);
    const $asmStmt = ClavaJoinPoints.stmtLiteral(asmLiteral);
    $arrayAccess.insertAfter($asmStmt);
  } else {
    const asmOperations = [readASM('%[x]', regName) ];
    const inputOperands = {
      'x': newName,
    };
    const asmLiteral = asmTemplate(asmOperations, inputOperands, {});
    
    const $asmStmt = ClavaJoinPoints.stmtLiteral(asmLiteral);
    $arrayAccess.insertBefore($asmStmt);
  }
  // Replace previous access with new variable
  const $newVarRef = ClavaJoinPoints.varRef(newName, type);
  $arrayAccess.replaceWith($newVarRef);
}
