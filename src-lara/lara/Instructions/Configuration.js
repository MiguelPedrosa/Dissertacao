Configuration.generateRead = function (descriptors, prefix, name) {
  const amountDesc = descriptors.length;

  if (amountDesc === 1) {
    return [_singleRead({ ...descriptors[0], prefix, name })];
  }

  const start = _startRead({ ...descriptors[0], prefix, name });
  const intermediates = descriptors.slice(1, amountDesc - 1).map((desc) => {
    return _betweenRead({ ...desc, prefix, name });
  });
  const end = _endRead({ ...descriptors[amountDesc - 1], prefix, name });

  return [start, ...intermediates, end];
}


Configuration.generateWrite = function (descriptors, prefix, name) {
  const amountDesc = descriptors.length;

  if (amountDesc === 1) {
    return [_singleWrite({ ...descriptors[0], prefix, name })];
  }

  const start = _startWrite({ ...descriptors[0], prefix, name });
  const intermediates = descriptors.slice(1, amountDesc - 1).map((desc) => {
    return _betweenWrite({ ...desc, prefix, name });
  });
  const end = _endWrite({ ...descriptors[amountDesc - 1], prefix, name });

  return [start, ...intermediates, end];
}



function _singleRead(attributes) {
  const { prefix, name, offset, size, stride } = attributes;

  return `ss.ld.${prefix} ${name}, %[${offset}], %[${size}], %[${stride}]`;
}

function _startRead(attributes) {
  const { prefix, name, offset, size, stride } = attributes;

  return `ss.sta.ld.${prefix} ${name}, %[${offset}], %[${size}], %[${stride}]`;
}

function _betweenRead(attributes) {
  const { name, offset, size, stride } = attributes;

  return `ss.app ${name}, %[${offset}], %[${size}], %[${stride}]`;
}

function _endRead(attributes) {
  const { name, offset, size, stride } = attributes;

  return `ss.end ${name}, %[${offset}], %[${size}], %[${stride}]`;
}


function _singleWrite(attributes) {
  const { prefix, name, offset, size, stride } = attributes;

  return `ss.st.${prefix} ${name}, %[${offset}], %[${size}], %[${stride}]`;
}

function _startWrite(attributes) {
  const { prefix, name, offset, size, stride } = attributes;

  return `ss.sta.st.${prefix} ${name}, %[${offset}], %[${size}], %[${stride}]`;
}

function _betweenWrite(attributes) {
  const { name, offset, size, stride } = attributes;

  return `ss.app ${name}, %[${offset}], %[${size}], %[${stride}]`;
}

function _endWrite(attributes) {
  const { name, offset, size, stride } = attributes;

  return `ss.end ${name}, %[${offset}], %[${size}], %[${stride}]`;
}