#include "Commun.h"
void core(double A[128][128], double k1[128], double k2[128], double v1[128], double v2[128], double w[128], double x[128], double y[128], double z[128], double alpha, double beta) {
   #pragma clava data uve : true
   for(int i = 0; i < 128; i++)
      asm volatile(
      "ss.st.d u0, %[JQMVUM], %[ISOTTH], %[AWMMFS] \n\t"
      "ss.ld.d u1, %[JQMVUM], %[ISOTTH], %[AWMMFS] \n\t"
      "so.v.dp.d u2, %[QJFAVS], p0 \n\t"
      "ss.ld.d u3, %[DCVTHO], %[ISOTTH], %[AWMMFS] \n\t"
      "so.v.dp.d u4, %[NIYMLI], p0 \n\t"
      "ss.ld.d u5, %[SPKMPE], %[ISOTTH], %[AWMMFS] \n\t"
      ".uve_loop_0_0_%=:  \n\t"
      "so.a.mul.fp u6, u2, u3, p0 \n\t"
      "so.a.add.fp u7, u1, u6, p0 \n\t"
      "so.a.mul.fp u8, u4, u5, p0 \n\t"
      "so.a.add.fp u0, u7, u8, p0 \n\t"
      "so.b.nc u0, .uve_loop_0_0_%= \n\t"
      :: [JQMVUM] "r" (A[i]), [ISOTTH] "r" (128), [AWMMFS] "r" (1), [QJFAVS] "r" (k1[i]), [DCVTHO] "r" (v1), [NIYMLI] "r" (k2[i]), [SPKMPE] "r" (v2)
      );
   for(int i = 0; i < 128; i++)
      for(int j = 0; j < 128; j++)
         x[i] = x[i] + beta * A[j][i] * y[j];
   #pragma clava data uve : true
   asm volatile(
   "ss.st.d u0, %[GGCPQT], %[GSJUKI], %[YXTJEJ] \n\t"
   "ss.ld.d u1, %[GGCPQT], %[GSJUKI], %[YXTJEJ] \n\t"
   "ss.ld.d u2, %[NLBJEF], %[GSJUKI], %[YXTJEJ] \n\t"
   ".uve_loop_1_0_%=:  \n\t"
   "so.a.add.fp u0, u1, u2, p0 \n\t"
   "so.b.nc u0, .uve_loop_1_0_%= \n\t"
   :: [GGCPQT] "r" (x), [GSJUKI] "r" (128), [YXTJEJ] "r" (1), [NLBJEF] "r" (z)
   );
   for(int i = 0; i < 128; i++)
      for(int j = 0; j < 128; j++)
         w[i] = w[i] + alpha * A[i][j] * x[j];
}
