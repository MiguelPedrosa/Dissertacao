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



~matos Identifica vários pontos da motivação para o uso de compilação src2src:
 - Permitir avançar mais rapidamente investigação em padrões de alto nível de otimização deixando os detalhes mais low-level para os compiladores existentes (por exemplo compiladores industriais para hardware específico) [separation of concern]
	 - Focar as soluções de transformação de código nos aspetos de extensibilidade para mais utilizadores poderem usar este tipo de técnicas vs ter de modificar compiladores específicos [evitar uma situação de M*N implementations)
	Desenvolvimento em ROSE parece ser feito usando uma biblioteca C/C++ (considerando o uso de templates nos exemplos de código deve ser mais em C++). Suponho que através de uma DSL embutida. Também há ferramentas standalone para casos de utilização comuns.
"The ROSE source-to-source compiler infrastructure"
https://citeseerx.ist.psu.edu/viewdoc/download?doi=10.1.1.459.1970&rep=rep1&type=pdf