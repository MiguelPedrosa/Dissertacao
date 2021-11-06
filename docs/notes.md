# Expression types

varref.type.desugarAll.instanceOf(“builtinType”)
varref.type.desugarAll.instanceOf(“builtinType”).isFloat

bitWidth: Integer(reference: joinpoint)
The bit width of this type in the Translation Unit of the given join point, or undefined if there is no bitwidth defined

$varref.bitWidth // Faz "de-sugar" do type



# Exception handling

try {
} catch(e) {
    println(e.stack);
}


# Simplify subscript expression
```
import lara.MathExtra;
simplify(expression, constants)
simplifyToC(expression, constants)
```
`expression` is a string
`constants` is a map of names to their compile-time values



# Benchmarks

import weaver.Query;
import lara.code.Energy;
import clava.Clava;

import lara.benchmark.PolybenchBenchmarkSet;
//import lara.benchmark.NasBenchmarkSet;

import lara.code.Timer;

aspectdef Launcher

/*
	var nasSet = new NasBenchmarkSet();
	nasSet.setBenchmarks("EP");
	println(nasSet.print());

	for(var instance of nasSet) {
		println(Query.root().code);
	}
*/	

	var polySet = new PolybenchBenchmarkSet();
	//polySet.setBenchmarks("2mm", "3mm");
	polySet.setBenchmarks("2mm");
    //polySet.setInputSizes ("SMALL", "MEDIUM");	
    polySet.setInputSizes ("SMALL");
    println(polySet.print());

    for(var instance of polySet) {
        println("Instance: " + instance.getName());
        //instance.load();

        (new Timer()).time(instance.getKernel());
        println("functions:");
        println(Query.search("function").get().map(jp => jp.name));

        instance.compile();
        //var executableFile = instance.compile();
        //println(executableFile);

    }
}