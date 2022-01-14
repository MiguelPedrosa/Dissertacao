

Dimension.work = function($loop) {
  const $innerloops = findFirstDimLoops($loop);
  $innerloops.forEach($inner => {
    let count = 0;
    println(`In loop of ${$inner.controlVar}`);
    const nonControlVars = findNonControlVarAccesses($inner, $inner.controlVar);
    nonControlVars.forEach($var => {
      println(`Found var: ${$var.name}`);
      const asm = _dupInsns({ ...getConstDescriptores($var), name: `u${count++}`});
      println(asm);
    });
    const nonControlAccess = findNonControlArrayAccesses($inner, $inner.controlVar);
    nonControlAccess.forEach($var => {
      println(`Found non-control access: ${$var.code}`);
      const asm = _dupInsns({ ...getConstDescriptores($var), name: `u${count++}`});
      println(asm);
    });
    const controllAccess = findControlArrayAccesses($inner, $inner.controlVar);

    controllAccess.forEach($var => {
      println(`Found control access: ${$var.code}`);
      const operation = $var.use === 'write' ? _singleWrite : _singleRead;
      const asm = operation({ ...getAccessDescriptores($inner, $var), name: `u${count++}`});
      println(asm);
    });

    // const replaceVars = [...nonControlAccess, ...nonControlVars];
    // println(`${replaceVars.length} variables to replace!`);
    // for (let i = 0; i < replaceVars.length; i++) {
    //   replaceWithTempBeforeLoop($inner, replaceVars[i], `_tmp_${i}`);
    // }
  });
}

function findFirstDimLoops($context) {
  // Given context might be already the innermost loop
  // In that case, we return it in a single element array
  // to keep return data consistent
  if ($context.isInnermost) {
    return [$context];
  }
  
  return Query.searchFrom($context, "loop", {
      isInnermost: i => i,
    }).get();
}

function findNonControlVarAccesses($context, controlVar) {
  // Exclude varref present in loop header
  if ($context.instanceOf('loop')) {
    $context = $context.body;
  }
  return Query.searchFrom($context, 'varref', {
      name: n => n !== undefined && n !== controlVar,
    })
    .get()
    .filter($ref => $ref.ancestor('arrayAccess') === undefined);
}

function findNonControlArrayAccesses($context, controlVar) {
  // Exclude any arrayAccess that might be in loop header
  if ($context.instanceOf('loop')) {
    $context = $context.body;
  }
  return Query.searchFrom($context, 'arrayAccess')
    .get()
    .filter($access => {
      return Query.searchFrom($access, 'varref', {
        name: n => n === controlVar,
      }).get().length === 0;
    });
}

function findControlArrayAccesses($context, controlVar) {
  // Exclude any arrayAccess that might be in loop header
  if ($context.instanceOf('loop')) {
    $context = $context.body;
  }
  const allAccess = Query.searchFrom($context, 'arrayAccess')
    .get()
    .filter($access => {
      return Query.searchFrom($access, 'varref', {
        name: n => n === controlVar,
      }).get().length !== 0;
    });
  for (const $access of allAccess) {
    const { subscript } = $access;
    const subscriptSize = subscript.length;
    for (let i = 0; i < subscriptSize -1; i++) {
      if (subscript[i].name === controlVar)
        throw new Error(`Cannot deal with array access with a preceding subscript equal to control variable. Found "${$access.code}" with control variable "${controlVar}"`);
    }
    if (subscript[subscriptSize - 1].name !== controlVar)
      throw new Error(`Cannot deal with array access with a final subscript different from control variable. Found "${$access.code}" with control variable "${controlVar}"`);
  };
  return allAccess;
}


function replaceWithTempBeforeLoop($loop, $ref, tempName) {
  // Depending on the usage, the construction and usage of new variable might
  // require extra operators (&, *) to maintain expected functionality
  const isWrite = $ref.use === 'write';
  // Create new variable using content of array access
  const $rhs = isWrite ? ClavaJoinPoints.unaryOp('&', $ref) : $ref;
  let $newVarDecl = ClavaJoinPoints.varDecl(tempName, $rhs);
  
  // Insert new declaration before loop
  $loop.insertBefore($newVarDecl);
  
  // Replace given access with new variable name
  const $varref = $newVarDecl.varref();
  const $usageJP = isWrite ? ClavaJoinPoints.unaryOp('*', $varref) : $varref;
  $ref.replaceWith($usageJP);
}

function getAccessDescriptores($loop, $access) {
  const widthMapping = {
    1 : 'b',
    2 : 'h',
    4 : 'w',
    8 : 'd',
  }
  const prefix = widthMapping[$access.bitWidth / 8];
 
  const stride = $loop.stepValue;
  //TODO: return all access except last subscript
  const offset = `&${$access.arrayVar.code}`;
  //TODO: size should be (endValue - initValue)/step
  const size = $loop.endValue;
  return {
    prefix, offset, size, stride
  }
}
function getConstDescriptores($access) {
  const widthMapping = {
    1 : 'b',
    2 : 'h',
    4 : 'w',
    8 : 'd',
  }
  const prefix = widthMapping[$access.bitWidth / 8];
  const value = $access.code;

  return {
    prefix, value
  }
}


function _singleRead(attributes) {
  const { prefix, name, offset, size, stride } = attributes;

  return `ss.ld.${prefix} ${name}, %[${offset}], %[${size}], %[${stride}]`;
}

function _singleWrite(attributes) {
  const { prefix, name, offset, size, stride } = attributes;

  return `ss.st.${prefix} ${name}, %[${offset}], %[${size}], %[${stride}]`;
}
function _dupInsns(attributes) {
  const { prefix, name, value } = attributes;

  return `so.v.dp.${prefix} ${name}, %[${value}], p0`;
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