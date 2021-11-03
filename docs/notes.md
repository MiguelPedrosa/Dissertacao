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