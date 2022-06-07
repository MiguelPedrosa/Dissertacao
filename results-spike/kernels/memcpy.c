#include "Commun.h"
void core(double dest[128], double src[128]) {
   #pragma clava data uve : true
   asm volatile(
   "ss.st.d u0, %[EHOGON], %[BIVCYH], %[DEEKNO] \n\t"
   "ss.ld.d u1, %[LECWRR], %[BIVCYH], %[DEEKNO] \n\t"
   ".uve_loop_0_0_%=:  \n\t"
   "so.v.mv u0, u1, p0 \n\t"
   "so.b.nc u0, .uve_loop_0_0_%= \n\t"
   :: [EHOGON] "r" (dest), [BIVCYH] "r" (128), [DEEKNO] "r" (1), [LECWRR] "r" (src)
   );
}
