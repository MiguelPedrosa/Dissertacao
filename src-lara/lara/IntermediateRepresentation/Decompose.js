Decompose.decomposeStatment = function ($stmt) {
  return _decomposeStatment($stmt);
};

let labelCount = 0;

function _decomposeStatment($stmt) {
  if ($stmt.joinPointType === "exprStmt") {
    const $expr = $stmt.expr;
    const [_, stmts] = _decomposeExpr($expr);
    return stmts;
  }
  if ($stmt.joinPointType === "returnStmt") {
    const $expr = $stmt.returnExpr;
    const [_, stmts] = _decomposeExpr($expr);
    return stmts;
  }
  if ($stmt.joinPointType === "if") {
    const stmts = _decomposeIf($stmt);
    return stmts;
  }
  if ($stmt.joinPointType === "body") {
    // TODO: Change children to use a more adequate atribute when one gets added
    const stmts = $stmt.children.reduce((prev, $curr) => {
      const newStmts = _decomposeStatment($curr);
      return [...prev, ...newStmts];
    }, []);
    return stmts;
  }
  println(`Cannot currently decompose statment of type: ${$stmt.joinPointType}`);
  return [];
}

function _decomposeIf($stmt) {
  const trueLabel = `true_${labelCount}`;
  const endLabel = `end_${labelCount}`;
  labelCount++;
  const [condRegister, condStmts] = _decomposeExpr($stmt.cond);
  const thenStmts = _decomposeStatment($stmt.then);
  const elseStmts = _decomposeStatment($stmt.else);

  const stmtLabelTrue = new Statment(StatmentTypes.label, trueLabel);
  const stmtLabelEnd = new Statment(StatmentTypes.label, trueLabel);
  const stmtGotoTrue = new Statment(StatmentTypes.gotoIF)
    .addMetadata({ label: trueLabel, cond: condRegister });
  const stmtGotoEnd = new Statment(StatmentTypes.goto)
    .addMetadata({ label: endLabel });

  return [
    ...condStmts,
    stmtGotoTrue,
    ...elseStmts,
    stmtGotoEnd,
    stmtLabelTrue,
    ...thenStmts,
    stmtLabelEnd,
  ];
}

function _decomposeExpr($expr) {
  switch ($expr.joinPointType) {
    case "binaryOp":
      return _decomposeBinaryOp($expr);
    case "varref":
      return _decomposeVarRef($expr);
    case "literal":
      return _decomposeLiteral($expr);
    case "unaryOp":
      return _decomposeUnaryOp($expr);
    default:
      println("Cannot currently decompose expression of type: " + $expr.joinPointType);
      return ['NO_NAME', []];
  }
}

function _decomposeBinaryOp($expr) {
  switch ($expr.operator) {
    case "=":
      return _decomposeAssignment($expr);
    case "+":
      return _decomposeBinaryArithmetic($expr, StatmentTypes.add);
    case "-":
      return _decomposeBinaryArithmetic($expr, StatmentTypes.sub);
    case "*":
      return _decomposeBinaryArithmetic($expr, StatmentTypes.mult);
    case "/":
      return _decomposeBinaryArithmetic($expr, StatmentTypes.div);
    case "<<":
      return _decomposeBinaryArithmetic($expr, StatmentTypes.shl);
    case ">>":
      return _decomposeBinaryArithmetic($expr, StatmentTypes.shr);
    case "&":
      return _decomposeBinaryArithmetic($expr, StatmentTypes.and);
    case "<":
      return _decomposeBinaryArithmetic($expr, StatmentTypes.less);
    case ">":
      return _decomposeBinaryArithmetic($expr, StatmentTypes.greatr);
    default:
      println("Cannot currently decompose BinaryOp of operation: " + $expr.operator);
      return ['NO_NAME', []];
  }
}

function _decomposeUnaryOp($expr) {
  switch ($expr.operator) {
    case "-":
      return _decomposeUnaryArithmetic($expr, StatmentTypes.neg);
    default:
      println("Cannot currently decompose UnaryOp of operation: " + $expr.operator);
      return ['NO_NAME', []];
  }
}

function _decomposeUnaryArithmetic($expr, type) {
  const [operandName, operandStmts] = _decomposeExpr($expr.operand);
  const register = new Register(registerType.vector);

  const newStmt = new Statment(type, register, [operandName]);
  return [register, [...operandStmts, newStmt]];
}

function _decomposeAssignment($assignment) {
  const type = StatmentTypes.mov;
  const [rightRegister, rightStmts] = _decomposeExpr($assignment.right);
  const name = $assignment.left.code;
  const register = new Register(registerType.vector, name);

  const newStmt = new Statment(type, register, [rightRegister]);
  return [register, [...rightStmts, newStmt]];
}

function _decomposeBinaryArithmetic($expr, type) {
  const [leftRegister, leftStmts] = _decomposeExpr($expr.left);
  const [rightRegister, rightStmts] = _decomposeExpr($expr.right);
  const register = new Register(registerType.vector);

  const newStmt = new Statment(type, register, [leftRegister, rightRegister]);
  return [register, [...leftStmts, ...rightStmts, newStmt]];
}

function _decomposeVarRef($expr) {
  const type = StatmentTypes.mov;
  const register = new Register(registerType.vector);

  const newStmt = new Statment(type, register, [$expr.code]);
  return [register, [newStmt]];
}

function _decomposeLiteral($expr) {
  const type = StatmentTypes.mov;
  const register = new Register(registerType.vector);

  const newStmt = new Statment(type, register, [$expr.code]);
  return [register, [newStmt]];
}