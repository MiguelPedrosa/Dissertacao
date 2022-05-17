#include "Commun.h"
void core(double src1[64][64], double src2[64][64], double src3[64][64]) {
   #pragma clava data uve : true
   for(int i = 0; i < 64; i++) {
      asm volatile(
        "ss.st.d u0, %[offset0], %[size0], %[stride0] \n\t"
        "so.v.dp.d u1, %[value0], p0 \n\t"
        ".uve_loop_0_%=: \n\t"
        "so.v.mv u0, u1, p0 \n\t"
        "so.b.nc u0, .uve_loop_0_%= \n\t"
        :: [offset0] "r" (src1[i]), [size0] "r" (64), [stride0] "r" (1),
        [value0] "r" (0));
      for(int k = 0; k < 64; k++) {
         asm volatile(
         "ss.st.d u0, %[offset0], %[size0], %[stride0] \n\t"
         "ss.ld.d u1, %[offset1], %[size1], %[stride1] \n\t"
         "so.v.dp.d u2, %[value0], p0 \n\t"
         "ss.ld.d u3, %[offset2], %[size2], %[stride2] \n\t"
         ".uve_loop_1_%=: \n\t"
         "so.a.mul.fp u4, u2, u3, p0 \n\t"
         "so.a.add.fp u0, u1, u4, p0 \n\t"
         "so.b.nc u0, .uve_loop_1_%= \n\t"
            :: [offset0] "r" (src1[i]), [size0] "r" (64), [stride0] "r" (1),
            [offset1] "r" (src1[i]), [size1] "r" (64), [stride1] "r" (1),
            [offset2] "r" (src3[k]),  [size2] "r" (64), [stride2] "r" (1),
            [value0] "r" (src2[i][k]));
      }
   }
}
