ArrayAccess.extractAccesses = function ($loop) {
  const $accesses = Query.searchFrom($loop, "arrayAccess").get();

  let count = 0;
  for (let $access of $accesses) {
    extractSingleAccess($access, '_a' + count);
    count++;
  }
}

ArrayAccess.replaceCommonAccesses = function ($loop) {
  const $accesses = Query.searchFrom($loop, "arrayAccess").get();

  // Compare every access with ones that follow
  // If access pattern is the same, replace them with 
  for (let i = 0; i < $accesses.length; i++) {
    for (let j = i + 1; j < $accesses.length; j++) {
      // TODO: This check always passes since .data.use returns undefined in both cases
      const sameUsageCheck = $accesses[i].data.use === $accesses[j].data.use;
      const sameAccessPatternCheck = areAccessPatternsEqual($accesses[i], $accesses[j]);
      if (sameUsageCheck && sameAccessPatternCheck) {
        println("Found write stream");
      }
    }
  }
}


function extractSingleAccess($arrayAccess, newName) {
  // Depending on the usage, the construction and usage of new variable might
  // require extra operators (&, *) to maintain expected functionality
  const isWrite = $arrayAccess.use === 'write';
  // Create new variable using content of array access
  const $rhs = isWrite ? ClavaJoinPoints.unaryOp('&', $arrayAccess) : $arrayAccess;
  const $newVarDecl = ClavaJoinPoints.varDecl(newName, $rhs);

  // Find the nearest parent that is a for-loop
  let $parentLoop = $arrayAccess.ancestor('loop');
  // Do not perform changes if there isn't a surrounding for-loop
  if ($parentLoop === undefined) {
    return;
  }

  // Insert new declaration inside loop body, before any existing statments
  const $firstLoopStmt = $parentLoop.body.children[0];
  $firstLoopStmt.insertBefore($newVarDecl);

  // Replace given access with new variable name
  const $varref = $newVarDecl.varref();
  const $usageJP = isWrite ? ClavaJoinPoints.unaryOp('*', $varref) : $varref;
  $arrayAccess.replaceWith($usageJP);
};


function areAccessPatternsEqual($accessLHS, $accessRHS) {
  // TODO: Actually compare subscript patterns
  return true;
}