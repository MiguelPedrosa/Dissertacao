#include "Commun.h"



#ifdef RUN_UVE
void core(DataType A[SIZE], DataType B[SIZE], DataType ct) {
  asm volatile(
    "ss.ld.d    u1, %[src1a], %[sn], %[one] \t\n" 
    "ss.ld.d    u2, %[src1b], %[sn], %[one] \t\n" 
    "ss.ld.d    u3, %[src1c], %[sn], %[one] \t\n" 
    "ss.st.d    u4, %[src2],  %[sn], %[one] \t\n"
    "so.v.dp.d  u20, %[ct],    p0            \t\n"
    : : [src1a] "r" (src1), [src1b] "r" (src1+1),
      [src1c] "r" (src1+2), [sn] "r"(sizeN - 2),
      [src2] "r" (src2+1), [one] "r" (1), [ct] "r" (ct)
  );
  asm volatile(
	".uve_loop%= : \t\n"
    "so.a.add.fp   u10, u1,  u2,  p0 \t\n"
    "so.a.add.fp   u10, u10, u3,  p0 \t\n"
    "so.a.mul.fp   u4,  u10, u20, p0 \t\n"
    "so.b.nc       u1,  .uve_loop%= \t\n"
  );
}
#endif // RUN_UVE


#ifdef RUN_SIMPLE
void core(DataType A[SIZE], DataType B[SIZE], DataType ct) {
  for (int i = 1; i < SIZE - 1; i++) {
    B[i] = ct * (A[i-1] + A[i] + A[i + 1]);
  }

  for (int i = 1; i < SIZE - 1; i++) {
    A[i] = ct * (B[i-1] + B[i] + B[i + 1]);
  }
}
#endif // RUN_SIMPLE


#ifdef RUN_CLAVA
void core(DataType A[SIZE], DataType B[SIZE], DataType ct) {
  #pragma clava data uve : true
  for (int i = 1; i < SIZE - 1; i++) {
    B[i] = ct * (A[i-1] + A[i] + A[i + 1]);
  }

  #pragma clava data uve : true
  for (int i = 1; i < SIZE - 1; i++) {
    A[i] = ct * (B[i-1] + B[i] + B[i + 1]);
  }
}
#endif // RUN_CLAVA


#ifdef RUN_BLANK
void core(DataType A[SIZE], DataType B[SIZE], DataType ct) {
}
#endif // RUN_BLANK
