class UVEContext {

  constructor(ID) {
    /* This uniquely idenfifies a loop. Useful for loop with multiple
    individual UVE sections so that labels don't clash */
    this.contextID = ID;
    /* Label counter that get incremented per label usage */
    this.labelCounter = 0;
    /* Make 32 registers, all marked as unused */
    this.streamRegs = [... Array(32).keys()].map(() => false);
    /* Make 15 registers. We don't build a p0, because this never be a used
    temporary as it is a register thats always runs an instruction */
    this.predicateRegs = [... Array(15).keys()].map(() => false);
    /* Store all statments used in assembly generation */
    this.statments = [];
    /* Store all operands used in assembly generation */
    /* Uses the literal as key and maps to the variable name within the assembly */
    this.operands = new Map();
  }

  buildLabel() {
    /* contextID uniquely identifies each UVE section. Label counter is so that
    each UVE section can have more that one label; in practice this is never used
    but we implemented for future proof. The last symbol %= is because the compiler
    might inline and unrool a function code. If this happens we have a repetition of
    loop labels. This symbol keeps track of each asm statment that is unrolled and
    uniquely indexes them, ensuring each label is unique. */
    return `.uve_loop_${this.contextID}_${this.labelCounter++}_%=`;
  }

  getUnusedStreamRegister() {
    const regIDX = this.streamRegs.findIndex(v => !v);
    if (regIDX === -1) return false;
    this.streamRegs[regIDX] = true;
    return `u${regIDX}`;
  }

  getUnusedPredRegister() {
    const regIDX = this.predicateRegs.findIndex(v => !v);
    if (regIDX === -1) return false;
    this.predicateRegs[regIDX] = true;
    return `p${regIDX + 1}`;
  }

  generateUniqueOperandName(name) {
    if (this.operands.has(name)) {
      return this.operands.get(name);
    }
    const generateLetter = () =>
      String.fromCharCode(Math.floor((Math.random() * 25) + 65));
    const generator = () =>
      [...Array(6).keys()].map(_=>generateLetter()).join('');

    const alreadyPresentNames = [...this.operands.values()];
    let operand = generator();
    while (alreadyPresentNames.includes(op => op === operand)) {
      operand = generator();
    }

    this.operands.set(name, operand);
    return operand;
  }

  getOperands() {
    return this.operands;
  }

};
