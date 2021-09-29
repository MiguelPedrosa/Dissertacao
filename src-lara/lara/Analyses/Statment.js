Statment.processStatment = function (stmt) {
  if (stmt.expr !== undefined) {
    switch (stmt.expr) {
      case "binaryOp":
        processBinaryOp(stmt);
        break;
      default:
        println("Cannot currently process ExprStmt of type: " + stmt.expr);
    }

  } else {
    switch (stmt.type) {
      case "binaryOp":
        processBinaryOp(stmt);
        break;
      default:
        println("Cannot currently process statment of type: " + stmt.type);
    }
  }
}

function processBinaryOp(stmt) {
  println("Inside binary OP!");
}