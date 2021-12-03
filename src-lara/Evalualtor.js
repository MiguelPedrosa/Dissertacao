

function compareExecutionResults(name, result1, result2) {
  let { stdout: stdout1 } = result1;
  let { stdout: stdout2 } = result2;
  const epsilon = 0.00001;
  stdout1 = stdout1.split("\n");
  stdout2 = stdout2.split("\n");

  if (stdout1.length !== stdout2.length) {
    println(`Results ${name} have different length`);
    return false;
  }

  for (let i = 0; i < stdout1.length; i++) {
    const num1 = parseFloat(stdout1[i]);
    const num2 = parseFloat(stdout2[i]);

    if (Math.abs(num1 - num2) > epsilon) {
      println(`Results ${name} do not match`);
      return false;
    }
  }

  return true;
}