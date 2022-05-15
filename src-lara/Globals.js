laraImport("weaver.Query");
laraImport("lara.ArrayAccess");
laraImport("lara.DesugarExpression");
laraImport("lara.Decompose");


function getUVECandidates() {
  return Query.search("loop", { data: data => data.uve }).get();
}

function getTransformations() {
  return [
    desugarLoop,
    extractAccesses,
    decomposeExpressions,
    // replaceCommonAccesses,
    removeUnusedVariables,
  ];
}
