laraImport("lara.Io");
laraImport("clava.Clava");
laraImport("weaver.Query");

function loadBenchmark(benchmarkName, extraFlags = "") {
	println(`Loading ${benchmarkName}`);

	const config = Clava.getData();
	const currentFolderFolder = config.getContextFolder();
  config.setFlags("-Wall -pedantic -DRUN_SIMPLE " + extraFlags);
	const benchmarkFolder = Io.getPath(currentFolderFolder, "./benchmarks");
	const kernelFile = Io.getPath(benchmarkFolder, benchmarkName + "/kernel.c");

  /* Make Commun.h accessible to compile kernel.c */
	config.setUserIncludes(benchmarkFolder.getAbsolutePath());

	Query.root().addFileFromPath(kernelFile);

	Clava.rebuild();
}