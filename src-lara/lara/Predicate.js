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
  println("Found " + $IFs.length + " IFs");

  for (let $if of $IFs) {
    const { cond, then, else: _else } = $if;

    /* Create NOT of cond */
    const newVarName = UVEContext.getUnusedPredRegister();
    const $negcond = ClavaJoinPoints.unaryOp('!', cond);
    /* NOTE: Using $context as the init opeartion forces the new variable type to
    be a 'bool' of C++, which is not recognized in C. As such, we cast to an 'int'
    so that it becomes a type commun one to both languages */
    const $newInit = ClavaJoinPoints.cStyleCast(ClavaJoinPoints.typeLiteral('int'), $negcond);
    const $varDecl = ClavaJoinPoints.varDecl(newVarName, $newInit);
    $if.insertBefore($varDecl);

    const $newThenStmts = prefixStatments(cond.name, then.stmts);
    for (let $newStmt of $newThenStmts) {
      $if.insertBefore($newStmt);
    }
    const $newElseStmts = prefixStatments(newVarName, _else.stmts);
    for (let $newStmt of $newElseStmts) {
      $if.insertBefore($newStmt);
    }

    $if.detach();
  }
}

function prefixStatments(predicate, $stmts) {
  const newStmts = [];

  for (let $stmt of $stmts) {
    if ($stmt.instanceOf("declStmt")) {
      continue;
    }

    println("Prefixing stmt (" + $stmt.code + ") with " + predicate);
    const $leftOperand = ClavaJoinPoints.varRef(predicate, ClavaJoinPoints.typeLiteral('int'));
    const $binaryOp = ClavaJoinPoints.binaryOp('&&', $leftOperand, $stmt.expr);
    newStmts.push($binaryOp);
  }

  return newStmts;
}