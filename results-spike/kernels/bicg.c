#include "Commun.h"
void core(double A[128][128], double s[128], double q[128], double p[128], double r[128]) {
   #pragma clava data uve : true
   asm volatile(
   "ss.st.d u0, %[NJRKIX], %[VWKPHO], %[FPVDME] \n\t"
   "so.v.dp.d u1, %[VVQQIU], p0 \n\t"
   ".uve_loop_0_0_%=:  \n\t"
   "so.v.mv u0, u1, p0 \n\t"
   "so.b.nc u0, .uve_loop_0_0_%= \n\t"
   :: [NJRKIX] "r" (s), [VWKPHO] "r" (128), [FPVDME] "r" (1), [VVQQIU] "r" (0.0)
   );
   for(int i = 0; i < 128; i++) {
      q[i] = 0.0;
      #pragma clava data uve : true
      asm volatile(
      "ss.st.d u0, %[IPIHEC], %[RRHENQ], %[EAJLOR] \n\t"
      "ss.ld.d u1, %[IPIHEC], %[RRHENQ], %[EAJLOR] \n\t"
      "so.v.dp.d u2, %[KMBGCB], p0 \n\t"
      "ss.ld.d u3, %[EXBKID], %[RRHENQ], %[EAJLOR] \n\t"
      ".uve_loop_1_0_%=:  \n\t"
      "so.a.mul.fp u4, u2, u3, p0 \n\t"
      "so.a.add.fp u0, u1, u4, p0 \n\t"
      "so.b.nc u0, .uve_loop_1_0_%= \n\t"
      :: [IPIHEC] "r" (s), [RRHENQ] "r" (128), [EAJLOR] "r" (1), [KMBGCB] "r" (r[i]), [EXBKID] "r" (A[i])
      );
      for(int j = 0; j < 128; j++) {
         q[i] = q[i] + A[i][j] * p[j];
      }
   }
}
