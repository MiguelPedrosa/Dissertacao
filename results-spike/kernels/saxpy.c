#include "Commun.h"
void core(double dest[64], double src[64], double A) {
   asm volatile(
      "ss.st.d u0, %[offset0], %[size0], %[stride0] \n\t"
      "ss.ld.d u1, %[offset1], %[size1], %[stride1] \n\t"
      "ss.ld.d u2, %[offset2], %[size2], %[stride2] \n\t"
      "so.v.dp.d u3, %[value1], p0 \n\t"
      ".uve_loop_%=: \n\t"
      "so.a.mul.fp u4, u2, u3, p0 \n\t"
      "so.a.add.fp u0, u1, u4, p0 \n\t"
      "so.b.nc u0, .uve_loop_%= \n\t"
   : :
      [offset0] "r" (dest), [size0] "r" (64), [stride0] "r" (1),
      [offset1] "r" (dest), [size1] "r" (64), [stride1] "r" (1),
      [offset2] "r" (src),  [size2] "r" (64), [stride2] "r" (1),
      [value1] "r" (A));

}
