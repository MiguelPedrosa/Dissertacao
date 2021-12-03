# Original code of a clamp function

```c
if (src < min) {
   *dest = min;
} else {
  if (src > max) {
     *dest = max;
  } else {
     *dest = src;
  }
}
```


# Code with extracted conditions

```c
bool p1 = src < min;
bool p2 = !p1;
if (p1) {
   *dest = min; // p1
} else { // p2
  bool p3 = src > max;
  bool p4 = !p3;
  if (p3) {
     *dest = max; // p2 && p3
  } else {
     *dest = src; // p2 && !p3
  }
}
```


# Flattened code with conditions used for short-circuit
```c
bool p1 = src < min;
p1 && *dest = min;
bool p12 = !p1;
bool p13 = src > max;
bool p14 = !p13;

bool p5 = p1 && p13 // After running, p1 and p13 are no longer needed
p5 && *dest = max;  // After running, p5 is no longer needed
bool p6 = p12 && p14 // After running, p12 and p14 are no longer needed

p6 && *dest = src;  // After running, p6 is no longer needed
```


# Alternative optimization without predicates

```c
#define MIN(a, b) (a < b ? a : b)
#define MAX(a, b) (a > b ? a : b)
// *dest = (src < min) ? min : (src < max ? src : max);
// *dest = (src < min) ? min : MIN(src, max);
*dest = MAX(min, MIN(src, max));

min temp, src, max
max dest, temp, min
```