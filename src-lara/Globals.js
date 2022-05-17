laraImport("lara.DesugarExpression");
laraImport("lara.ArrayAccess");
laraImport("lara.Decompose");
laraImport("lara.Predicate");
laraImport("lara.Generate");


function getTransformations() {
  return [
    desugarLoop,
    extractAccesses,
    decompose,
    // decomposePredicates,
    generate,
    // replaceCommonAccesses,
    removeUnusedVariables,
  ];
}
