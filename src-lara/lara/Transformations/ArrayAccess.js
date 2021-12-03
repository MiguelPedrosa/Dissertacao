ArrayAccess.extractAccesses = function ($loop) {
  const $accesses = Query.searchFrom($loop, "arrayAccess").get();

  let count = 0;
  for (let $access of $accesses) {
    extractSingleAccess($access, '_a' + count);
    count++;
  }
}

ArrayAccess.replaceCommonAccesses = function ($context) {
  findAndReplaceCommunAccesses($context);
}


ArrayAccess.removeUnusedVariables = function ($context) {
  removeUnusedDeclarations($context);
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


function findAllContextAccessDecls($context) {
  return Query.searchFrom($context, "vardecl", {
      init: initExpr => {
        const isRead = initExpr.joinPointType === "arrayAccess";
        const isWrite = initExpr.joinPointType === "unaryOp"
          && initExpr.operator === "&"
          && initExpr.operand.joinPointType === "arrayAccess";
        return isRead || isWrite;
      }
    }).get()
    .filter(decl => decl.ancestor('loop').astId === $context.astId);
}

function findChildrenLoops($context) {
  return Query
    .searchFrom($context, "loop").get()
    .filter(l => l.ancestor('loop').astId === $context.astId);
}


function findAndReplaceCommunAccesses($context) {
  const $decls = findAllContextAccessDecls($context);

  // Compare all initiallizations of declarations
  for (let i = 0; i < $decls.length; i++) {
    for (let j = i + 1; j < $decls.length; j++) {
      // Write streams are initiallized with '&' so that
      // the resulting variable can be written to
      // An expression stating with this operand is a
      // write stream, else it's a read stream
      const iswriteI = $decls[i].init.operator === '&';
      const iswriteJ = $decls[j].init.operator === '&';
      // Both streams need to be simultaneously read or
      // write to be considered equal/replaceable
      if (iswriteI !== iswriteJ)
        continue;
      // Depending on the type, grab the correct code literal
      const codeI = iswriteI ? $decls[i].init.operand.code : $decls[i].init.code;
      const codeJ = iswriteJ ? $decls[j].init.operand.code : $decls[j].init.code;
      if (arePatternsEqual(codeI, codeJ)) {
        replaceVarrefName($context, $decls[i].name, $decls[j].name);
      }
    }
  }

  const $descendingLoops = findChildrenLoops($context);
  $descendingLoops.forEach($descending => findAndReplaceCommunAccesses($descending));
}

function replaceVarrefName($context, oldName, newName) {
  const usages = Query.searchFrom($context, "varref", {
    name : n => n === oldName
  }).get();
  usages.forEach(ref => {
    const $newVarRef = ClavaJoinPoints.varRef(newName, ref.type);
    ref.replaceWith($newVarRef);
  });
}

function arePatternsEqual(lhs, rhs) {
  const simpleLHS = MathExtra.simplify(lhs);
  const simpleRHS = MathExtra.simplify(rhs);
  return simpleLHS === simpleRHS;
}

function removeUnusedDeclarations($context) {
  // Grab all declarations to check their usage
  const $decls = Query.searchFrom($context, "vardecl", {
    // Params can also be vardecls so avoid grabing these
    joinPointType: jpt => jpt !== 'param'
  }).get();
  for (const $decl of $decls) {
    // Find how many times the variable is used in the current context
    const usages = Query.searchFrom($context, "varref", {
      name: n => n === $decl.name
    }).get().length;
    // If the variable is never referenced, then it can be deleted
    if (usages === 0) {
      // TODO: Replace this print with removal of variable declaration
      println(`Removing variable: ${$decl.name}`);
      // $decl.detach();
    }
  }
}