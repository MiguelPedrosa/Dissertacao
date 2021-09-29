Inspector.printJoinPoints = function (jp) {
  if (jp === undefined) {
    jp = Query.root();
  }
  printChildren(jp, 0);
}

Inspector.printClavaPragma = function (jp) {
  println(Object.keys(jp.data));
};


function printChildren(node, currentLevel) {
  const tab = "\t";
  const indentation = tab.repeat(currentLevel);
  for (let $child of node.getChildren()) {
    println(indentation + $child);
    printChildren($child, currentLevel + 1);
  }
}

