
laraImport("weaver.Query");

function printJoinPoints($jp) {
  if ($jp === undefined) {
    $jp = Query.root();
  }
  printChildren($jp, 0);
}

function printClavaPragma($jp) {
  println(Object.keys($jp.data));
};


function printChildren(node, currentLevel) {
  const tab = "\t";
  const indentation = tab.repeat(currentLevel);
  for (let $child of node.getChildren()) {
    println(indentation + $child + ": " + $child.code);
    printChildren($child, currentLevel + 1);
  }
}

function stringfyObject(obj) {
  return Object
    .keys(obj)
    .map(k => `obj["${k}"]: ${obj[k]}`)
    .join(", ");
}