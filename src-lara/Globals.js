laraImport("weaver.Query");
laraImport("lara.Transformations.ArrayAccess");
laraImport("lara.Transformations.DesugarExpression");


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