Statment.processStatment = function (stmt) {
  const { expr } = stmt;
  if (expr !== undefined) {
    processExpression(expr);
  } else {
    switch (stmt.type) {
      default:
        println("Cannot currently process statment of type: " + stmt.type);
    }
  }
}

let registerCount = 0;

function processExpression(expr) {
  switch (expr.joinPointType) {
    case "binaryOp":
      return processBinaryOp(expr);
    case "varref":
      return processVarRef(expr);
    case "literal":
      return processLiteral(expr);
    default:
      println("Cannot currently process ExprStmt of type: " + expr.joinPointType);
  }
}

function processBinaryOp(expr) {
  switch (expr.operator) {
    case "=":
      return processAssignment(expr);
    case "+":
      return processAdition(expr);
    case "*":
      return processMultiplication(expr);
    case "-":
      return processSubtraction(expr);
    case "/":
      return processDivision(expr);
    default:
      println("Cannot currently process BinaryOp of operation: " + expr.operator);
  }
}

function processAssignment(expr) {
  const { left, right } = expr;

  const destinationRegister = processExpression(left);
  const sourceRegister = processExpression(right);

  println(`mv ${destinationRegister}, ${sourceRegister}`);
}

function processAdition(expr) {
  const { left, right } = expr;

  const leftRegister = processExpression(left);
  const rightRegister = processExpression(right);
  const resultRegister = `r${registerCount++}`;

  println(`add ${resultRegister}, ${leftRegister}, ${rightRegister}`);
  return resultRegister;
}

function processSubtraction(expr) {
  const { left, right } = expr;

  const leftRegister = processExpression(left);
  const rightRegister = processExpression(right);
  const resultRegister = `r${registerCount++}`;

  println(`sub ${resultRegister}, ${leftRegister}, ${rightRegister}`);
  return resultRegister;
}

function processMultiplication(expr) {
  const { left, right } = expr;

  const leftRegister = processExpression(left);
  const rightRegister = processExpression(right);
  const resultRegister = `r${registerCount++}`;

  println(`mult ${resultRegister}, ${leftRegister}, ${rightRegister}`);
  return resultRegister;
}

function processDivision(expr) {
  const { left, right } = expr;

  const leftRegister = processExpression(left);
  const rightRegister = processExpression(right);
  const resultRegister = `r${registerCount++}`;

  println(`div ${resultRegister}, ${leftRegister}, ${rightRegister}`);
  return resultRegister;
}

function processVarRef(expr) {
  return expr.name;
}

function processLiteral(expr) {
  return expr.code;
}