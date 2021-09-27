Debug.printJoinPoints = function (jp) {
  if (jp === undefined) {
    jp = Query.root();
  }
  printChildren(jp, 0);
}

Debug.printClavaPragma = function (jp) {
  println(Object.keys(jp.data));
};


function printChildren(node, currentLevel) {
  for (var $child of node.getChildren()) {
    var tab = "\t";
    var indentation = tab.repeat(currentLevel);

    println(indentation + $child);
    printChildren($child, currentLevel + 1);
  }
}

