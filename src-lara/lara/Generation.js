const { generateRead, generateWrite } = Configuration;


Generation.generateUVE = function(streamLoop, streamConfig) {
  return `
  asm volatile(
  "config: \\n\\t"
  ${_generateConfig(streamConfig)}
  "loop: \\n\\t"
  ${_generateLoop(streamLoop)}
  );`;
}

Generation.generateConfig = _generateConfig;

function _generateConfig(streamData) {
  const keys = Object.keys(streamData);

  const outputString = keys.map(currKey => {
    const currentStream = streamData[currKey];
    const registerName = currentStream.register;

    const instructions = _matchStreamType(currentStream, registerName);
    const instructionLiterals = instructions.join(" \\t\\n\n");

    return instructionLiterals;
  }).join('\n');

  return outputString;
}

function _generateLoop(streamLoop) {
  return streamLoop.statments.reduce( (prev, curr) => {
    const { type } = curr;
    let result = '';
    if (type === StatmentTypes.add) {
      result = `"so.a.add ${curr.result}, ${curr.operands.join(', ')}, ps0 \\n\\t"`;
    }
    if (type === StatmentTypes.sub) {
      result = `"so.a.sub ${curr.result}, ${curr.operands.join(', ')}, ps0 \\n\\t"`;
    }
    if (type === StatmentTypes.mult) {
      result = `"so.a.mult ${curr.result}, ${curr.operands.join(', ')}, ps0 \\n\\t"`;
    }
    if (type === StatmentTypes.div) {
      result = `"so.a.div ${curr.result}, ${curr.operands.join(', ')}, ps0 \\n\\t"`;
    }
    if (type === StatmentTypes.shl) {
      result = `"so.a.shl ${curr.result}, ${curr.operands.join(', ')}, ps0 \\n\\t"`;
    }
    if (type === StatmentTypes.shr) {
      result = `"so.a.shr ${curr.result}, ${curr.operands.join(', ')}, ps0 \\n\\t"`;
    }
    if (type === StatmentTypes.mov) {
      result = `"mv ${curr.result}, ${curr.operands[0]} \\n\\t"`;
    }
    return prev + '\t' + result + '\n';
  }, "");

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
    "width": 1,
  },
  "Half-Word": {
    "prefix": "h",
    "width": 2,
  },
  "Word": {
    "prefix": "w",
    "width": 4,
  },
  "Double-Word": {
    "prefix": "d",
    "width": 8,
  },
};
