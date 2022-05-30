laraImport("lara.MathExtra");
laraImport("weaver.Query");
laraImport("lara.Inspector");


function generate($context, UVEContext) {
  /* Calculate loop header properties */
  const loopHeaders = calculateLoopHeaders($context);

  for ( let $stmt of $context.body.stmts) {
    if (isStmtStreamDecl($stmt)) {
      const streamAcc = findStreamAccesses($stmt, $context.controlVar);
      prepareStreamDescriptores(streamAcc, loopHeaders);
    } else if (isIterationConst($stmt)) {

    } else {

    }
  }

}


function calculateLoopHeaders($loop) {
  let {stepValue, initValue, endValue } = $loop;
  stepValue = MathExtra.simplify(stepValue);
  initValue = MathExtra.simplify(initValue);
  endValue = MathExtra.simplify(endValue);
  const iterations = ( endValue - initValue) / stepValue;
  const start = initValue;

  return {
    stepValue, iterations, start,
  }
}

function findStreamAccesses($context, controlVar) {
  // Exclude any arrayAccess that might be in loop header
  if ($context.instanceOf('loop')) {
    $context = $context.body;
  }
  const allAccess = Query.searchFrom($context, 'vardecl')
    .get()
    .filter($access => {
      return Query.searchFrom($access, 'varref', {
        name: n => n === controlVar,
      }).get().length !== 0;
    });

  const filteredAccesses = allAccess.filter(($vardecl) => {
    let { init } = $vardecl;
    if (init.instanceOf('unaryOp') && init.operator === '&') {
      init = init.operand;
    }
    const { subscript } = init;
    const subscriptSize = subscript.length;
    for (let i = 0; i < subscriptSize -1; i++) {
      if (subscript[i].name === controlVar) {
        return false;
      }
    }
    return subscript[subscriptSize - 1].name === controlVar;
  });

  return filteredAccesses;
}


function prepareStreamDescriptores($varDecl, loopHeaders) {
  const{ stepValue, iterations, start } = loopHeaders;

  const registerName = $varDecl.name;
  const $arrayAccess = Query.searchFrom($varDecl, 'arrayAccess').get()[0];
  const { name } = $arrayAccess;
  const offset = MathExtra.simplify(name + " + " + start);
  const size = iterations;
  const stride = stepValue;
  const widthMapping = {
    1 : 'b',
    2 : 'h',
    4 : 'w',
    8 : 'd',
  }
  const width = widthMapping[$arrayAccess.bitWidth / 8];
  return { offset, size, stride, registerName, width };
}