#include "Commun.h"
void core(double A[64][64], double B[64][64], double C[64][64], double alpha, double beta) {
   #pragma clava data uve : true
   for(int i = 0; i < 64; i++) {
      asm volatile(
         "ss.st.d u0, %[offset0], %[size0], %[stride0] \n\t"
         "ss.ld.d u1, %[offset1], %[size1], %[stride1] \n\t"
         "so.v.dp.d u2, %[value1], p0 \n\t"
         ".uve_loop_0_%=: \n\t"
         "so.a.mul.fp u0, u1, u2, p0 \n\t"
         "so.b.nc u0, .uve_loop_0_%= \n\t"
         :: [offset0] "r" (C[i]), [size0] "r" (64), [stride0] "r" (1),
         [offset1] "r" (C[i]), [size1] "r" (64), [stride1] "r" (1),
         [value1] "r" (beta));
      for(int k = 0; k < 64; k++) {
         asm volatile(
         "ss.st.d u0, %[offset0], %[size0], %[stride0] \n\t"
         "ss.ld.d u1, %[offset1], %[size1], %[stride1] \n\t"
         "so.v.dp.d u2, %[value1], p0 \n\t"
         "ss.ld.d u3, %[offset2], %[size2], %[stride2] \n\t"
         "so.v.dp.d u4, %[value2], p0 \n\t"
         ".uve_loop_%=: \n\t"
         "so.a.mul.fp u5, u4, u2, p0 \n\t"
         "so.a.mul.fp u6, u5, u3, p0 \n\t"
         "so.a.add.fp u0, u1, u6, p0 \n\t"
         "so.b.nc u0, .uve_loop_%= \n\t"
         :: [offset0] "r" (C[i]), [size0] "r" (64), [stride0] "r" (1),
         [offset1] "r" (C[i]), [size1] "r" (64), [stride1] "r" (1),
         [offset2] "r" (B[k]),  [size2] "r" (64), [stride2] "r" (1),
         [value1] "r" (A[i][k]), [value2] "r" (alpha));
      }
   }
}
