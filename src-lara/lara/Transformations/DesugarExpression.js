DesugarExpression.desugarLoop = function ($loop) {
  try {
    desugarBinaryOPAssigns($loop);
    desugarTernaryOperator($loop);
  } catch (e) {
    println(e);
  }
}


function desugarBinaryOPAssigns($loop) {
  // Map the search operators to the one used to replace
  const operators = {
    "+=": "+",
    "-=": "-",
    "*=": "*",
    "/=": "/",
    "%=": "%",
    "<<=": "<<",
    ">>=": ">>",
    "&=": "&",
    "^=": "^",
    "|=": "|",
  };


  // Find all operations that include a use of the previous operators
  const opKeys = Object.keys(operators);
  const $targetJPs = Query.searchFrom($loop, "binaryOp", {
    operator: op => opKeys.includes(op),
  }).get();

  for (const $expr of $targetJPs) {
    const $left = $expr.left;
    let $right = $expr.right;
    const type = $expr.type;
    const newOperator = operators[$expr.operator];
    // Place parenthesis around right-side expression
    // so priority of operation is always respected
    // "a *= b + c" expands to "a = a * (b + c)" and not "a = a * b + c"
    $right = ClavaJoinPoints.parenthesis($right);
    const $rhs = ClavaJoinPoints.binaryOp(newOperator, $left, $right, type);
    const $assignment = ClavaJoinPoints.binaryOp("=", $left, $rhs, type);
    $expr.replaceWith($assignment);
  }
}


function desugarTernaryOperator($loop) {
  const $targetJPs = Query.searchFrom($loop, "ternaryOp").get();
  let count = 0;
  const prefix = '_tr';
  for (var $tern of $targetJPs) {
    const $cond = $tern.cond;
    const $trueExpr = $tern.trueExpr;
    const $falseExpr = $tern.falseExpr;
    // Declare new temporary variable
    const tempName = `${prefix}${count++}`;
    const $varDecl = ClavaJoinPoints.varDeclNoInit(tempName, $trueExpr.type);
    $tern.insertBefore($varDecl);

    // Build assignments of true/false condition to temporary variable
    const $trueAssign = ClavaJoinPoints.assign(ClavaJoinPoints.varRef(tempName, $varDecl.type), $trueExpr);
    const $falseAssign = ClavaJoinPoints.assign(ClavaJoinPoints.varRef(tempName, $varDecl.type), $falseExpr);

    const $ifStmt = ClavaJoinPoints.ifStmt($cond, $trueAssign, $falseAssign);
    $tern.ancestor("statement").insertBefore($ifStmt);
    // Replace ternary operation with new variable reference
    $tern.replaceWith(ClavaJoinPoints.varRef(tempName, $varDecl.type));
  }
}