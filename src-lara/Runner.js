
function runBenchmark(name = "test", debug = false) {

  // Compile
  const cmaker = new CMaker(`build-${name}`);
  cmaker.addCurrentAst();
  const execFile = cmaker.build();
  debug && println(`Building cmake config: ${execFile.getAbsolutePath()}`);

  // Execute
  const executor = new ProcessExecutor();
  executor.setPrintToConsole(false);
  debug && println(`Runing executable: ${execFile.getAbsolutePath()}`);
  const execOutput = executor.execute(execFile.getAbsolutePath());

  return {
    returnValue: executor.getReturnValue(),
    stdout: executor.getStdOut(),
    stderr: executor.getStdErr(),
  };
}