# Base example
```c
  a = b * c + b * c
```

# "Dumb" version
```S
ld u1, b
ld u2, c
st a, u3
loop:
mv ut1, u1
mv ut2, u2
mul ut3, ut1, ut2
add ut4, ut3, ut3
mv u3, ut4
jnc loop, u1
```

# Oportunities
ut1 -> u1
ut2 -> u2
ut4 -> u3

# Optimized version
```S
ld u1, b
ld u2, c
st a, u3
loop:
mul ut3, u1, u2
add u3, ut3, ut3
jnc loop, u1
```
