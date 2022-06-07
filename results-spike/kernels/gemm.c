#include "Commun.h"
void core(double A[128][128], double B[128][128], double C[128][128], double alpha, double beta) {
   #pragma clava data uve : true
   for(int i = 0; i < 128; i++) {
      asm volatile(
      "ss.st.d u0, %[VCRHER], %[PMDVXV], %[HSSYNH] \n\t"
      "ss.ld.d u1, %[VCRHER], %[PMDVXV], %[HSSYNH] \n\t"
      "so.v.dp.d u2, %[GKHPBV], p0 \n\t"
      ".uve_loop_0_0_%=:  \n\t"
      "so.v.mv u3, u2, p0 \n\t"
      "so.a.mul.fp u0, u1, u3, p0 \n\t"
      "so.b.nc u0, .uve_loop_0_0_%= \n\t"
      :: [VCRHER] "r" (C[i]), [PMDVXV] "r" (128), [HSSYNH] "r" (1), [GKHPBV] "r" (beta)
      );
      for(int k = 0; k < 128; k++) {
         asm volatile(
         "ss.st.d u0, %[HGSXCK], %[OJKTLT], %[YNAGQD] \n\t"
         "ss.ld.d u1, %[HGSXCK], %[OJKTLT], %[YNAGQD] \n\t"
         "so.v.dp.d u2, %[PBSXLV], p0 \n\t"
         "ss.ld.d u3, %[HINVYW], %[OJKTLT], %[YNAGQD] \n\t"
         "so.v.dp.d u4, %[BBWWND], p0 \n\t"
         ".uve_loop_1_0_%=:  \n\t"
         "so.a.mul.fp u5, u4, u2, p0 \n\t"
         "so.a.mul.fp u6, u5, u3, p0 \n\t"
         "so.a.add.fp u0, u1, u6, p0 \n\t"
         "so.b.nc u0, .uve_loop_1_0_%= \n\t"
         :: [HGSXCK] "r" (C[i]), [OJKTLT] "r" (128), [YNAGQD] "r" (1), [PBSXLV] "r" (A[i][k]), [HINVYW] "r" (B[k]), [BBWWND] "r" (alpha)
         );
      }
   }
}
