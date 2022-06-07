#include "Commun.h"
void core(double dest[128], double src[128], double A) {
   #pragma clava data uve : true
   asm volatile(
   "ss.st.d u0, %[RENCWJ], %[LNWHEG], %[VLXSSS] \n\t"
   "ss.ld.d u1, %[RENCWJ], %[LNWHEG], %[VLXSSS] \n\t"
   "ss.ld.d u2, %[NOBGQU], %[LNWHEG], %[VLXSSS] \n\t"
   "so.v.dp.d u3, %[CEFWVY], p0 \n\t"
   ".uve_loop_0_0_%=:  \n\t"
   "so.a.mul.fp u4, u2, u3, p0 \n\t"
   "so.a.add.fp u0, u1, u4, p0 \n\t"
   "so.b.nc u0, .uve_loop_0_0_%= \n\t"
   :: [RENCWJ] "r" (dest), [LNWHEG] "r" (128), [VLXSSS] "r" (1), [NOBGQU] "r" (src), [CEFWVY] "r" (A)
   );
}
