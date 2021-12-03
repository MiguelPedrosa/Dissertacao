# Base example
```c
a = c * b + c
```

# "Dumb" version
```S
ld c, u1
ld b, u2
st a, u3
loop:
mv ut1, u1
mv ut2, u2
mul ut3, ut1, ut2
add ut4, ut3, ut1
mv u3, ut4
jnc loop, u1
```

# Oportunities
ut2 -> u2
ut4 -> u3

# Optimized version
```S
ld c, u1
ld b, u2
st a, u3
loop:
mv ut1, u1
# mv u2, u2
mul ut3, ut1, u2
add u3, ut3, ut1
# mv u3, u3
jnc loop, u1
```
