enum Opcode {
  add,
  sub,
  mult,
  div,
};
type Register = `r${number}`;

class Instruction {
  constructor(
    public opcode: Opcode,
    public inputsRegisters: Register[],
    public outputRegister: Register,
    public constOperands?: any[],
  ) {}
}

class Block {
  constructor(
    readonly label: string,
    public instructions: Instruction[],
    public nextBlock: Block[],
  ) {}
}

class IntermediateRepresentation {
  constructor(
    public blocks: Block[],
    public entry: Block,
  ) {}
};

