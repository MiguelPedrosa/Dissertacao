const { generateRead, generateWrite } = Configuration;


Generation.generateLoopConfig = function (streamData) {
  const keys = Object.keys(streamData);
  let registerCounter = 0;

  const outputString = keys.reduce((prev, currKey) => {
    const currentStream = streamData[currKey];
    const registerName = `u${registerCounter++}`;

    const instructions = _matchStreamType(currentStream, registerName);
    const instructionLiterals = instructions.reduce((prev, curr) => prev + `\t"${curr}  \\t\\n"\n`, "");

    return prev + '\n' + instructionLiterals;
  }, "");

  return `asm volatile(\n\t"config:"\n${outputString});`;
}



function _matchStreamType(stream, registerName) {
  const { type, descriptors, datatype } = stream;
  const { prefix } = _datatypes[datatype];

  const typeMapping = {
    "write": generateWrite,
    "read": generateRead,
  }

  const match = typeMapping[type];
  if (match === undefined) {
    println("Cannot currently process instruction type: " + type);
    return [];
  }

  return match(descriptors, prefix, registerName);
}


const _datatypes = {
  "Byte": {
    "prefix": "b",
  },
  "Half-Word": {
    "prefix": "h",
  },
  "Word": {
    "prefix": "w",
  },
  "Double": {
    "prefix": "d",
  },
};
