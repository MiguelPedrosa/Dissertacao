const StatmentTypes = {
  // 1. Binary operations
  add: 'add',
  sub: 'sub',
  mult: 'mult',
  div: 'div',
  shl: 'shl',
  shr: 'shr',
  and: 'and',
  or: 'or',
  less: 'less',
  greatr: 'greatr',
  // 2. Unary operations
  neg: 'neg',
  conv: 'conv', // used for casts
  // 3. Copy operations
  mov: 'mov',
  // 4. Indexing operations
  load: 'load',
  store: 'store',
  mov: 'mov',
  // 5. Unconditional jumps
  goto: 'goto',
  // 6. Conditional jumps
  gotoIF: 'gotoIF',
  // 7. Procedure calls
  param: 'param',
  call: 'call',
  // 8. Memory Assignment
  addr: 'addr',
  defer: 'defer',
  // 9. Utility
  label: 'label', // useful for labeling statments for jumps
  nop: 'nop',
};


class Statment {
  constructor(type, result, operands, metadata) {
    this.type = type;
    this.result = result;
    this.operands = operands; // Array of operand names
    this.metadata = metadata;
  }

  addMetadata(newData) {
    this.metadata = { ...this.metadata, ...newData };
    return this;
  }

  toString() {
    const operandsLiteral = this.operands !== undefined ? ', ' + this.operands
        // .map((op) => op.toString())
        .join(', ')
      : '';
    const metadataLiteral = this.metadata !== undefined ? " " + JSON.stringify(this.metadata) : '';
    const resultLiteral = this.result || '';
    return `${this.type} ${resultLiteral}${operandsLiteral}${metadataLiteral}`;
  }
}