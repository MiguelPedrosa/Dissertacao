let registerCount = 0;

class Register {
  constructor(type, name, metadata) {
    this.type = type;
    this.name = name || registerCount++;
    this.metadata = metadata;
  }

  toString() {
    return `${this.type[0]}_${this.name}`;
  }

  getName() {
    return this.toString();
  }
}

const registerType = {
  pred: 'pred',
  stream: 'stream',
  vector: 'vector',
}
