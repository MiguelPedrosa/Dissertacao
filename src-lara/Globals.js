laraImport("weaver.Query");
laraImport("lara.ArrayAccess");
laraImport("lara.DesugarExpression");


function getUVECandidates() {
  return Query.search("loop", { data: data => data.uve }).get();
}

function getTransformations() {
  return [
    desugarLoop,
    extractAccesses,
    // replaceCommonAccesses,
    removeUnusedVariables,
  ];
}
