laraImport("lara.MathExtra");
laraImport("weaver.Query");
laraImport("lara.Inspector");


function generate($context, UVEContext) {
  /* Calculate loop header properties */
  const loopHeaders = calculateLoopHeaders($context);
  /* Calculate stream/vector configurations */
  const configs = processConfigs($context, loopHeaders, UVEContext);

  
  /* Find and genenerate all computation statments */
  const $computationStmts = Query.searchFrom($context.body, "exprStmt").get();
  const compStmts = processComputations($computationStmts);

  /* Build assembly literal */
  const label = UVEContext.buildLabel();
  const operands = [...UVEContext.getOperands().entries()].map(v=>`[${v[1]}] "r" (${v[0]})`);
  const asmLiteral =
`asm volatile(
${configs.map(s => `"${s} \\n\\t"`).join('\n')}
"${label}:  \\n\\t"
${compStmts.map(s => `"${s} \\n\\t"`).join('\n')}
"so.b.nc u0, ${label} \\n\\t"
:: ${operands.join(', ')}
);`;

  /* Replace for loop with assembly literal */
  const assembly = ClavaJoinPoints.stmtLiteral(asmLiteral);
  $context.replaceWith(assembly);
}

function processComputations($stmts) {
  return $stmts.map(({ expr: $expr }) => {
    if ($expr.joinPointType === 'binaryOp') {
      const { operator } = $expr;
      const $jp = operator === '&&' ? $expr.right : $expr;
      const predicate = operator === '&&' ? $expr.left.name : 'p0';
      return processPredOperation($jp, predicate);
    }

    return `Found unexpected ${$expr.joinPointType}: ${$expr.code}`;
  });
}

function processPredOperation($expr, predicate) {
  const { operator, left: $left, right: $right } = $expr;
  if (operator !== '=') {
    throw new Error(`Received unknown operand type to process at generation stage: ${operator}`);
  }
  /* Extract destination name */
  const isStore = $left.joinPointType === 'unaryOp' && $left.operator === '*';
  const destName = isStore ? $left.operand.name : $left.name;
  const type = $left.type.desugar.code;
  const isFP = type === 'double' || type === 'float';
  const fpInfo = isFP ? '.fp' : '';

  /* Extract operands name */
  if ($right.joinPointType === 'binaryOp') {
    const {operator, left: $left, right: right} = $right;

    if (operator === '+') {
      return `so.a.add${fpInfo} ${destName}, ${$left.name}, ${right.name}, ${predicate}`;
    } else if (operator === '-') {
      return `so.a.sub${fpInfo} ${destName}, ${$left.name}, ${right.name}, ${predicate}`;
    } else if (operator === '*') {
      return `so.a.mul${fpInfo} ${destName}, ${$left.name}, ${right.name}, ${predicate}`;
    } else if (operator === '/') {
      return `so.a.div${fpInfo} ${destName}, ${$left.name}, ${right.name}, ${predicate}`;
    } else if (operator === '<') {
      return `so.p.lt${fpInfo} ${destName}, ${$left.name}, ${right.name}, ${predicate}`;
    } else if (operator === '>=') {
      return `so.p.egt${fpInfo} ${destName}, ${$left.name}, ${right.name}, ${predicate}`;
    } 

  } else if ($right.joinPointType === 'unaryOp') {
    const {operator, operand: { name }} = $right;
    if (operator === '!') {
      return `so.p.not ${destName}, ${name}, ${predicate}`;
    }

  } else if ($right.joinPointType === 'varref' || $right.instanceOf("literal")) {
    /* move operation */
    return `so.v.mv ${destName}, ${$right.name}, ${predicate}`;
  }

  return `Const: ${operator}, ${destName}, ${$right.code}`
}

function calculateLoopHeaders($loop) {
  let { stepValue, initValue, endValue, controlVar } = $loop;
  stepValue = MathExtra.simplify(stepValue);
  initValue = MathExtra.simplify(initValue);
  endValue = MathExtra.simplify(endValue);
  const iterations = ( endValue - initValue) / stepValue;
  const start = initValue;

  return {
    stepValue, iterations, start, controlVar
  }
}

function processConfigs($context, loopHeaders, UVEContext) {

  /* Isolate all variables declarations. These can be potencial streams of consts */
  const $variableDeclarations = Query.searchFrom($context.body, "vardecl", {
    hasInit: i => i,
  }).get();

  const assertDeclarations = determineStreams($variableDeclarations, loopHeaders.controlVar);

  return assertDeclarations.map(({isStream, $jp}) => {
    if (isStream) { 
      const { type, offset, size, stride,
        reg, width } = prepareStreamDescriptores($jp, loopHeaders);
      const offsetID = UVEContext.generateUniqueOperandName(offset);
      const sizeID = UVEContext.generateUniqueOperandName(size);
      const strideID = UVEContext.generateUniqueOperandName(stride);
      return `ss.${type}.${width} ${reg}, %[${offsetID}], %[${sizeID}], %[${strideID}]`
    } else { // Const value
      const { value, reg, width, pred } = prepareConstDescriptores($jp);
      const valueID = UVEContext.generateUniqueOperandName(value);
      return `so.v.dp.${width} ${reg}, %[${valueID}], ${pred}`;
    }
  });

}

function determineStreams($variableDeclarations, controlVar) {
  return $variableDeclarations.map($decl => {
    const { init: $init } = $decl;
    const { subscript } = $init.joinPointType === 'unaryOp' ? $init.operand : $init;
    if (subscript === undefined) {
      return {
        'isStream': false,
        '$jp': $decl,
      };
    }
    for (let i = 0; i < subscript.length -1; i++) {
      if (subscript[i].name === controlVar) {
        throw new Error(`Cannot generate UVE for access ${init.code} in control var ${controlVar}`);
      }
    }
    return {
      'isStream': subscript[subscript.length - 1].name === controlVar,
      '$jp': $decl,
    };
  });
}

function prepareStreamDescriptores($varDecl, loopHeaders) {
  const widthMapping = {
    1 : 'b',
    2 : 'h',
    4 : 'w',
    8 : 'd',
  }
  const{ stepValue, iterations } = loopHeaders;
  
  const reg = $varDecl.name;
  const code = $varDecl.init.code;
  const isStore = $varDecl.init.joinPointType === 'unaryOp' && $varDecl.init.operator === '&';
  const offset = code.slice(isStore ? 1 : 0, code.length - 3);
  const size = iterations;
  const stride = stepValue;
  const { bitWidth } = isStore ? $varDecl.init.operand : $varDecl;
  const width = widthMapping[bitWidth / 8];
  const type = isStore ? 'st' : 'ld';
  return { type, offset, size, stride, reg, width };
}

function prepareConstDescriptores($varDecl) {
  const widthMapping = {
    1 : 'b',
    2 : 'h',
    4 : 'w',
    8 : 'd',
  }

  const reg = $varDecl.name;
  const value = $varDecl.init.code;
  const pred = 'p0';
  const width = widthMapping[$varDecl.init.bitWidth / 8];

  return { value, reg, width, pred };
}