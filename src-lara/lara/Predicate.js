laraImport("clava.ClavaJoinPoints");


function decomposePredicates($context, UVEContext) {
  try {
    flattenIfs($context, UVEContext);
  } catch (e) {
    println(e);
  }
}

function flattenIfs($context, UVEContext) {
  const $IFs = Query.searchFrom($context, "if").get();

  for (let $if of $IFs) {
    const { cond: $cond, then: $then, else: $else } = $if;
    const condNameFalse = UVEContext.getUnusedPredRegister();
    const condNameTrue = $cond.name;
    
    /* Declare negative condition variable of if's test */
    addNegationVariable($if, $cond, condNameFalse);

    /* Add all statments that are expected to run */
    const $thenStmts = prefixStatments(condNameTrue, $then.stmts);
    const $elseStmts = prefixStatments(condNameFalse, $else.stmts);
    const $allStmts = [...$thenStmts, ...$elseStmts];
    $allStmts.forEach($stmt => {
      $if.insertBefore($stmt)
    });

    $if.detach();
  }
}

function addNegationVariable($if, $cond, conditionFalseName) {
  const $negcond = ClavaJoinPoints.unaryOp('!', $cond);
  const $notPredDecl = ClavaJoinPoints.varDeclNoInit(conditionFalseName, $cond.type);
  $if.insertBefore($notPredDecl);
  const $negVarRef = ClavaJoinPoints.varRef(conditionFalseName, $negcond.type);
  const $newAssign = ClavaJoinPoints.assign($negVarRef, $negcond);
  $if.insertBefore($newAssign);
}


function prefixStatments(predicate, $stmts) {
  const $newStmts = $stmts.map(($stmt) => {
    if ($stmt.instanceOf("declStmt")) {
      return null;
    }
    const intLiteral = ClavaJoinPoints.typeLiteral('int');
    const $leftOperand = ClavaJoinPoints.varRef(predicate, intLiteral);
    return ClavaJoinPoints.binaryOp('&&', $leftOperand, $stmt.expr, intLiteral);
  });

  return $newStmts.filter(s => s !== null);
}