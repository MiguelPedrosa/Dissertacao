const { decomposeStatment } = Decompose;

IR.build = function ($stmts, extraData) {
  const IR = new IntermediateRepresentation();
  $stmts.forEach($stmt => IR.addStatment($stmt, extraData));
  return IR;
}

IR.updateClava = function (representation) {
  return;
}

IR.optimize = function (baseRepresentation) {
  return baseRepresentation;
}


class IntermediateRepresentation {
  constructor() {
    // Maps a register's name to its metadata
    this.statments = [];
  }

  getRegisterMetadata(name) {
    return this.registers.get(name);
  }

  addStatment($stmt) {
    const stmts = decomposeStatment($stmt);
    this.statments = [...this.statments, ...stmts];
  }

  printContents() {
    for (const stmt of this.statments)
      println(stmt.toString());
  }
}
