ArrayAccess.extractAccesses = function ($loop) {
  const $accesses = Query.searchFrom($loop, "arrayAccess").get();

  let count = 0;
  for (let $access of $accesses) {
    extractSingleAccess($access, '_access' + count);
    count++;
  }
}

ArrayAccess.replaceCommunAccesses = function ($loop) {
  const $accesses = Query.searchFrom($loop, "arrayAccess").get();

  // Compare every access with ones that follow
  // If access pattern is the same, replace them with 
  for (let i = 0; i < $accesses.length; i++) {
    for (let j = i + 1; j < $accesses.length; j++) {
      // TODO: This check always passes as .data.use returns undefined in both cases
      const sameUsageCheck = $accesses[i].data.use === $accesses[j].data.use;
      const sameAccessPatternCheck = areAccessPatternsEqual($accesses[i], $accesses[j]);
      if (sameUsageCheck && sameAccessPatternCheck) {
        println("Found write stream");
      }

    }
  }
}


function extractSingleAccess($arrayAccess, newName) {
  // Create new variable using content of array access
  const $newVarDecl = ClavaJoinPoints.varDecl(newName, $arrayAccess);
  $newVarDecl.data.isStream = true;
  $newVarDecl.data.use = $arrayAccess.use;

  // Find the nearest parent that is a for-loop
  let $parentLoop = $arrayAccess.parent;
  while ($parentLoop !== undefined && !$parentLoop.instanceOf("loop")) {
    $parentLoop = $parentLoop.parent;
  }

  // Insert new declaration inside loop body, before any existing statments
  const $firstLoopStmt = $parentLoop.body.children[0];
  $firstLoopStmt.insertBefore($newVarDecl);

  // Replace given access with new variable name
  $arrayAccess.replaceWith(newName);
};


function areAccessPatternsEqual($accessLHS, $accessRHS) {
  // TODO: Actually compare subscript patterns
  return true;
}