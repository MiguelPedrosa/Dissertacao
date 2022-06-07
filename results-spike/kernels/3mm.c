#include "Commun.h"
void core(double src1[128][128], double src2[128][128], double src3[128][128]) {
   #pragma clava data uve : true
   for(int i = 0; i < 128; i++) {
      asm volatile(
      "ss.st.d u0, %[BCJSNJ], %[JHVLYU], %[TYONRD] \n\t"
      "so.v.dp.d u1, %[JTTUHI], p0 \n\t"
      ".uve_loop_0_0_%=:  \n\t"
      "so.v.mv u0, u1, p0 \n\t"
      "so.b.nc u0, .uve_loop_0_0_%= \n\t"
      :: [BCJSNJ] "r" (src1[i]), [JHVLYU] "r" (128), [TYONRD] "r" (1), [JTTUHI] "r" (0.0)
      );
      for(int k = 0; k < 128; k++) {
         asm volatile(
         "ss.st.d u0, %[MVLKCK], %[LCUDJD], %[NTPGLN] \n\t"
         "ss.ld.d u1, %[MVLKCK], %[LCUDJD], %[NTPGLN] \n\t"
         "so.v.dp.d u2, %[HWWNMV], p0 \n\t"
         "ss.ld.d u3, %[WJSUMR], %[LCUDJD], %[NTPGLN] \n\t"
         ".uve_loop_1_0_%=:  \n\t"
         "so.a.mul.fp u4, u2, u3, p0 \n\t"
         "so.a.add.fp u0, u1, u4, p0 \n\t"
         "so.b.nc u0, .uve_loop_1_0_%= \n\t"
         :: [MVLKCK] "r" (src1[i]), [LCUDJD] "r" (128), [NTPGLN] "r" (1), [HWWNMV] "r" (src2[i][k]), [WJSUMR] "r" (src3[k])
         );
      }
   }
}
