laraImport("weaver.Query");
laraImport("lara.Simplification.ArrayAccess");
laraImport("lara.Simplification.DesugarExpression");


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

function getBenchmarksInfo() {
  return [
    // { name: "floyd-marshall" },
    // { name: "saxpy" },
    // { name: "trisolv" },
    // { name: "gemm" },
    { name: "covariance" },
  ];
}