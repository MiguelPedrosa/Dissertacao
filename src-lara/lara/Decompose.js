laraImport("lara.Inspector");

function decompose($context, UVEContext) {
  decomposeExpressions($context, UVEContext);
}

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

  } else if ($context.instanceOf("varref") || $context.instanceOf("literal")) {
    /* Do nothing. These are 'terminal' instances
    that should remain as they are */

  } else {
    println("Unexpected jp of " + $context.joinPointType + " : " + $context.code);

  }
}

function decomposeSingleExpr($context, UVEContext) {
  // printJoinPoints($context);
  const { left, right, operator, joinPointType, code } = $context;
  const logicalOperators = ['&&', '||', '!'];
  const arithmeticOperators = ['+', '-', '*', '/', '<', '<=', '>', '>='];
  // println("Received section: " + $context.code); /* Helper debug print */

  if (operator === '=') {
    decomposeExpressions(right, UVEContext);
  } else if (logicalOperators.includes(operator)) {
    if (left.instanceOf("binaryOp")) {
      decomposeSingleExpr(left, UVEContext);
      logicalReplaceExpr(left, UVEContext);

    } else if (right.instanceOf("binaryOp")) {
      decomposeSingleExpr(right, UVEContext);
      logicalReplaceExpr(right, UVEContext);
      /* TODO: Find better way to detect parenthesis */
    } else if(left.code[0] === '(') {
      decomposeSingleExpr(left.children[0], UVEContext);
      logicalReplaceExpr(left.children[0], UVEContext);
      left.replaceWith(left.children[0]);
      /* TODO: Find better way to detect parenthesis */
    } else if(right.code[0] === '(') {
      decomposeSingleExpr(right.children[0], UVEContext);
      logicalReplaceExpr(right.children[0], UVEContext);
      right.replaceWith(right.children[0]);

    }

  } else if (arithmeticOperators.includes(operator)) {
    if (left.instanceOf("binaryOp")) {
      decomposeSingleExpr(left, UVEContext);
      arithmeticReplaceExpr(left, UVEContext);

    } else if (right.instanceOf("binaryOp")) {
      decomposeSingleExpr(right, UVEContext);
      arithmeticReplaceExpr(right, UVEContext);
      /* TODO: Find better way to detect parenthesis */
    } else if(left.code[0] === '(') {
      decomposeSingleExpr(left.children[0], UVEContext);
      arithmeticReplaceExpr(left.children[0], UVEContext);
      left.replaceWith(left.children[0]);
      /* TODO: Find better way to detect parenthesis */
    } else if(right.code[0] === '(') {
      decomposeSingleExpr(right.children[0], UVEContext);
      arithmeticReplaceExpr(right.children[0], UVEContext);
      right.replaceWith(right.children[0]);

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
  /* We take a context in the form of (1) and transform it into (2). We could
  abreviate the new declaration into (3), however in future analysis interpreting
  if it is a declaration of a stream or a temporary becomes much harder.
  (1) a = b + c * d;
  (2) T t;
      t = c * d;
      a = b + t;
  (3) T t = c * d; */
  const newVarName = UVEContext.getUnusedStreamRegister();
  /* First, declare the new variable and place it before the replaced statment */
  const $varDecl = ClavaJoinPoints.varDeclNoInit(newVarName, $context.type);
  $context.insertBefore($varDecl);
  /* Then, we assign the variable to the value of the replacing operation */
  const $newOperation = ClavaJoinPoints.varRef(newVarName, $context.type);
  const $newAssign = ClavaJoinPoints.assign($newOperation, $context);
  $context.insertBefore($newAssign);
  /* Finally, we replace expression with new variable reference */
  const $newRef = ClavaJoinPoints.varRef(newVarName, $context.type);
  $context.replaceWith($newRef);
}

function logicalReplaceExpr($expression, UVEContext) {
  /* The logic here is similar to function arithmeticReplaceExpr's. The difference
  is that using $expression as the init opeartion forces the new variable type to
  be a 'bool' of C++, which is not recognized in C. As such, we use a type 'int'
  so that it becomes a type commun one to both languages */
  const newVarName = UVEContext.getUnusedPredRegister();
  const boolType = ClavaJoinPoints.typeLiteral('int');
  /* First, declare the new variable and place it before the replaced statment */
  const $varDecl = ClavaJoinPoints.varDeclNoInit(newVarName, boolType);
  $expression.insertBefore($varDecl);
  /* Then, we assign the variable to the value of the replacing operation */
  const $newVar = ClavaJoinPoints.varRef(newVarName, boolType);
  const $newAssign = ClavaJoinPoints.assign($newVar, $expression);
  $expression.insertBefore($newAssign);
  /* Finally, we replace expression with new variable reference */
  const $newRef = ClavaJoinPoints.varRef(newVarName, boolType);
  $expression.replaceWith($newRef);
}
