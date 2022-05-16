function decomposeExpressions($context, UVEContext) {
  if ($context.instanceOf("loop")) {
    decomposeExpressions($context.body, UVEContext);

  } else if ($context.instanceOf("scope")) {
    const { stmts } = $context;
    for (let i = 0; i < stmts.length; i++) {
      decomposeExpressions(stmts[i], UVEContext);
    }

  } else if ($context.instanceOf("if")) {
    const { cond, then, else: _else } = $context;
    decomposeSingleExpr(cond, UVEContext);
    logicalReplaceExpr(cond, UVEContext);

    decomposeExpressions(then, UVEContext);
    decomposeExpressions(_else, UVEContext);

  } else if ($context.instanceOf("declStmt")) {
    /* We ignore these */

  } else if ($context.instanceOf("exprStmt")) {
    decomposeExpressions($context.expr, UVEContext);

  } else if ($context.instanceOf("binaryOp")) {
    decomposeSingleExpr($context, UVEContext);

  } else {
    println("Unexpected jp of " + $context.joinPointType + " : " + $context.code);

  }
}

function decomposeSingleExpr($context, UVEContext) {
  const { left, right, operator, joinPointType, code } = $context;
  const logicalOperators = ['&&', '||', '!'];
  const arithmeticOperators = ['+', '-', '*', '/', '<', '<=', '>', '>='];

  if (operator === '=') {
    decomposeExpressions(right, UVEContext);
  } else if (logicalOperators.includes(operator)) {
    if (left.instanceOf("binaryOp")) {
      decomposeSingleExpr(left, UVEContext);
      logicalReplaceExpr(left, UVEContext);
    } else if (right.instanceOf("binaryOp")) {
      decomposeSingleExpr(right, UVEContext);
      logicalReplaceExpr(right, UVEContext);
    }

  } else if (arithmeticOperators.includes(operator)) {
    if (left.instanceOf("binaryOp")) {
      decomposeSingleExpr(left, UVEContext);
      arithmeticReplaceExpr(left, UVEContext);
    } else if (right.instanceOf("binaryOp")) {
      decomposeSingleExpr(right, UVEContext);
      arithmeticReplaceExpr(right, UVEContext);
    }

  } else {
    println("Expression " + joinPointType + ": " + code);
    println("Operator: " + operator);
    println("Left:" + left);
    println("Right: " + right);
    println();
  }

}

function arithmeticReplaceExpr($context, UVEContext) {
  const newVarName = UVEContext.getUnusedStreamRegister();
  /* Move expression to a new variable statment before the current expression */
  const $varDecl = ClavaJoinPoints.varDecl(newVarName, $context);
  $context.insertBefore($varDecl);
  /* Replace expression with new variable reference */
  const $newRef = ClavaJoinPoints.varRef(newVarName, $context.type);
  $context.replaceWith($newRef);
}

function logicalReplaceExpr($context, UVEContext) {
  const newVarName = UVEContext.getUnusedPredRegister();
  /* Move expression to a new variable statment before the current expression */
  /* NOTE: Using $context as the init opeartion forces the new variable type to
   be a 'bool' of C++, which is not recognized in C. As such, we cast to an 'int'
   so that it becomes a type commun one to both languages */
  const $newInit = ClavaJoinPoints.cStyleCast(ClavaJoinPoints.typeLiteral('int'), $context);
  const $varDecl = ClavaJoinPoints.varDecl(newVarName, $newInit);
  $context.insertBefore($varDecl);
  /* Replace expression with new variable reference */
  const $newRef = ClavaJoinPoints.varRef(newVarName, $context.type);
  $context.replaceWith($newRef);
}