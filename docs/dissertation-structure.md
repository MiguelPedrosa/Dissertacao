# Structure for Dissertation


## Abstract


## 1. Introduction

### 1.1 Contexto
- Impacto do trabalho


### 1.2 Motication
  - UVE é só programado à mão... error prone...
  - Abordagem mais flexível a alterações


### 1.3 Objectives


### 1.4 Document Structure


## 2. Background e Related Work

### 2.1. Streaming Analysis
  - Análise dos conceitos de streaming
  - Trabalhos onde foram procurados descrever padrões de acesso em streaming 


### 2.2. Unlimited Vector Extension

#### 2.2.1. Architecture Description
  - Registos vetoriais/escalares e predicados
  - Instruções aritméticas/lógica, manipulação de vetores, branching

#### 2.2.2. Stream access patterns



### 2.3. Source-to-source Compilation
  - Ease of use: Clava provides a JavaScript-based interface with high-level abstractions, and can be installed in under a minute. No need to mess with the internals of a compiler;
  - Gradual learning curve: you can start with simple examples, and advance to more complex transformations gradually;
  - No compiler lock-in: you can do analyses/transformations with Clava, and then use any compiler to compile your code;


### 2.4 Existing Tools
  - gem5: Ferramenta usada para benchmarks do UVE. Incluí já modificações para corretamente implementar as utilidades necessárias para correr código UVE e analisar resultados derivados da execussão.
  - clava: Ferramenta usada para transformações de código source-to-source. Incluí funcionalidades para analisar e modificar código fonte, assim com outros utilitários que facilitam estas alterações. A ferramenta mantém um ciclo de desenvolvimento bastante ativo, por isso a adicionação de funcionalidades extra ou modificação de atuais é bastante rápida e produtiva.

### 2.5. Conclusão
  - Criar tabela para comparar com trabalhos existentes e conteúdo aproveitável para o trabalho
  - Identificação de limitações para justificar o trabalho a fazer
  - Identificar a direção do trabalho


## 3. Descrição de transformações

Como neste trabalho é procurada a geração de código assembly a partir de código fonte, podemos procurar utilizar as fases que um compilador otimizante faria para gerar target code procurando sempre acabar uma etapa com código fonte válido. Tirando proveito deste processo podemos realizar testes antes e após cada transformação e estudar se o resultado das diferentes execussões é idêntico. Em caso afirmativo, obtivemos código válido e mais semelhante ao procurado assembly code final. Em caso negativo, podemos rever a transformação procurando bugs ou erros na sua implementação ou realiando a sua importância/impacto.

É de salientar que somente procuramos transformar secções críticas de computação onde é possível utilizar código UVE, isto é, só procuramos adaptar loops (cabeçados e corpos) que sejam vetorizáveis. Assim sendo, não será gerado código alvo para funções inteiras nem para a invocação destas assim como código não vetorizável.

### 3.1. Front End
Nesta etapa é feito o parsing e verificações semânticas do código fonte. Apesar de ser uma etapa específica à linguagem, é uma boa oportunidade para reformular construções desta que simplificaram a escrita de código fonte para esta linguagem, mas dificultam futuras análises pois exigem atenção particular. Podem, no entanto, ser rescritas com uma construção semanticamente igual:

#### Ternary operator:
Se no código fonte surgir a seguinte construção:
```c
// Declaração da variável result com um tipo adequado
// ...
result = cond ? expr1 : expr2;
```
Podemos substituir pela seguinte construção:
```c
// Declaração da variável result com um tipo adequado
// ...
if (cond) {
    result = expr1;
} else {
    result = expr2;
}
```
#### Increment/Decrement operators:
Os operadores de sufixo incremento(`value++`) e decremento(`value--`) podem ser substituídos na expressão em que são usados pelas seguintes construções:
```c
result = expr++;
```
```c
result = expr;
expr = expr + 1;
```

De forma análoga, os operadores de prefixo(`++value` e `--value`) podem ser substituídos por:
```c
result = ++expr;
```
```c
expr = expr + 1;
result = expr;
```

#### Compond assignments:
Os operadores de atribuição (`+=`, `-=`, `*=`, `/=`, `%=`, `<<=`, `>>=`, `&=`, `^=` e `|=`) utilizam um único símbolo para reprensentar uma escrita e uma leitura de valor, que pode ser substituído por uma contrução com dois símbolos em que o uso de cada um destes se torna único. Por exemplo:

```c
a += 4;
```
Pode ser rescrito para:
```c
a = a + 4;
```

Nesta transformação uma simples substituíção textual não é suficiente pois é necessário atendar à prioridade de operações. Assim sendo, é necessário garantir que a linha de código:
```c
a *= b + c
```
É convertida para
```c
a = a * (b + c)
```
E não para:
```c
a = a * b + c
```

### 3.2. Flow Graph Building
### 3.3. Dominator Optimization
### 3.4. Interprocedural Optimization
### 3.5. Dependence Optimization
### 3.6. Global Optimization
### 3.7. Limiting Resources
### 3.8. Instruction Schedulling
### 3.9. Register Allocation
### 3.10. Instruction Reschedulling
### 3.11. Form Object Module

## 4. Results and discussion


## 5. Conclusion


