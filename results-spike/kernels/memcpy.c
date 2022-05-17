#include "Commun.h"
void core(double dest[64], double src[64]) {
   asm volatile(
      "ss.st.d u0, %[offset0], %[size0], %[stride0] \n\t"
      "ss.ld.d u1, %[offset1], %[size1], %[stride1] \n\t"
      ".uve_loop_%=: \n\t"
      "so.v.mv u0, u1, p0 \n\t"
      "so.b.nc u0, .uve_loop_%= \n\t"
   : :
      [offset0] "r" (dest), [size0] "r" (64), [stride0] "r" (1),
      [offset1] "r" (src), [size1] "r" (64), [stride1] "r" (1));
}
