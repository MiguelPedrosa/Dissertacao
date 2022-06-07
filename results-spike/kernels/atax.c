#include "Commun.h"
void core(double A[128][128], double x[128], double y[128], double tmp[128]) {
   #pragma clava data uve : true
   asm volatile(
   "ss.st.d u0, %[IFHQOB], %[KNHEGI], %[JRSSIN] \n\t"
   "so.v.dp.d u1, %[MWXOHY], p0 \n\t"
   ".uve_loop_0_0_%=:  \n\t"
   "so.v.mv u0, u1, p0 \n\t"
   "so.b.nc u0, .uve_loop_0_0_%= \n\t"
   :: [IFHQOB] "r" (y), [KNHEGI] "r" (128), [JRSSIN] "r" (1), [MWXOHY] "r" (0.0)
   );
   for(int i = 0; i < 128; i++) {
      tmp[i] = 0.0;
      for(int j = 0; j < 128; j++) {
         tmp[i] = tmp[i] + A[i][j] * x[j];
      }
      #pragma clava data uve : true
      asm volatile(
      "ss.st.d u0, %[HHJATI], %[SREXEK], %[HGNFHX] \n\t"
      "ss.ld.d u1, %[HHJATI], %[SREXEK], %[HGNFHX] \n\t"
      "ss.ld.d u2, %[TDOJAR], %[SREXEK], %[HGNFHX] \n\t"
      "so.v.dp.d u3, %[PDOPOJ], p0 \n\t"
      ".uve_loop_1_0_%=:  \n\t"
      "so.a.mul.fp u4, u2, u3, p0 \n\t"
      "so.a.add.fp u0, u1, u4, p0 \n\t"
      "so.b.nc u0, .uve_loop_1_0_%= \n\t"
      :: [HHJATI] "r" (y), [SREXEK] "r" (128), [HGNFHX] "r" (1), [TDOJAR] "r" (A[i]), [PDOPOJ] "r" (tmp[i])
      );
   }
}
