#include "Commun.h"
void core(double path[64][64]) {
   #pragma clava data uve : true
   for(int k = 0; k < 64; k++) {
      for(int i = 0; i < 64; i++) {
         asm volatile(
         "ss.st.d u0, %[BJCJAY], %[UAUWGW], %[IDAXJB] \n\t"
         "ss.ld.d u4, %[BJCJAY], %[UAUWGW], %[IDAXJB] \n\t"
         "so.v.dp.d u5, %[MPEKMB], p0 \n\t"
         "ss.ld.d u6, %[VNFHTN], %[UAUWGW], %[IDAXJB] \n\t"
         ".uve_loop_0_0_%=:  \n\t"
         "so.a.add.fp u8, u5, u6, p0 \n\t"
         "so.p.lt p1, u4, u8, p0 \n\t"
         "so.p.not p2, p1, p0 \n\t"
         "so.v.mv u7, u4, p1 \n\t"
         "so.a.add.fp u7, u5, u6, p2 \n\t"
         "so.v.mv u0, u7, p0 \n\t"
         "so.b.nc u0, .uve_loop_0_0_%= \n\t"
         :: [BJCJAY] "r" (path[i]), [UAUWGW] "r" (64),
            [IDAXJB] "r" (1), [MPEKMB] "r" (path[i][k]),
            [VNFHTN] "r" (path[k])
         );
      }
   }
}
