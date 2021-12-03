

function loadBenchmark(folder) {
	println(`Loading ${folder}`);

	const config = Clava.getData();
	const baseFolder = config.getContextFolder();
	const baseFolderPath = Io.getPath(baseFolder, folder);
	const includeFolderPath = Io.getPath(baseFolderPath, "include");
	const sourceFolderPath = Io.getPath(baseFolderPath, "src");
	config.setUserIncludes(includeFolderPath.getAbsolutePath());

	for (const srcFile of Io.getFiles(sourceFolderPath)) {
		Query.root().addFileFromPath(srcFile);
	}

	Clava.rebuild();
}