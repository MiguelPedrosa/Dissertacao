
function getUVECandidates() {
  return Query.search("loop", { data: data => data.uve }).get();
}

function getTransformations() {
  return [
    DesugarExpression.desugarLoop,
    ArrayAccess.extractAccesses,
    ArrayAccess.replaceCommonAccesses,
    ArrayAccess.removeUnusedVariables,
  ];
}

function getBenchmarksInfo() {
  return [
    { name: "floyd-marshall" },
    { name: "saxpy" }
  ];
}