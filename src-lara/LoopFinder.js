laraImport("weaver.Query");

function getUVECandidates() {
  /* Find all loops targetting UVE in the source code */
  const codeLoops = Query.search("loop", { data: data => data.uve }).get();
  /* Only process the innermost loops of each source loop */

  return codeLoops.reduce((acc, curr) => {
    const innerLoops = findFirstDimLoops(curr);
    return [...acc, ...innerLoops];
  }, []);
}

function findFirstDimLoops($context) {
  // Given context might be already the innermost loop
  // In that case, we return it in a single element array
  // to keep return data consistent
  if ($context.isInnermost === true) {
    return [$context];
  }
  
  return Query.searchFrom($context, "loop", {
      isInnermost: i => i === true,
    }).get();
}