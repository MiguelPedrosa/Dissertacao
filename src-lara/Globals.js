laraImport("lara.DesugarExpression");
laraImport("lara.ArrayAccess");
laraImport("lara.Decompose");
laraImport("lara.Predicate");
laraImport("lara.Generate");


function getTransformations() {
  return [
    desugarBinaryOPAssigns,
    desugarComparisons,
    extractAccesses,
    desugarTernaryOperator,
    decompose,
    //replaceCommonAccesses,
    removeUnusedVariables,
    // decomposePredicates,
    // generate,
  ];
}
