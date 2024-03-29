#include "Commun.h"



#ifdef RUN_UVE
void core(DataType dest[SIZE], DataType src[SIZE]) {
	asm volatile(
		"ss.st.d  u1, %[dest], %[size], %[stride] \t\n"
		"ss.ld.d  u2,  %[src], %[size], %[stride] \t\n"
		:: [dest] "r" (dest),
      [src] "r" (src),
      [size] "r" (SIZE),
      [stride] "r" (1));
	asm volatile(
		".uve_loop%= : \t\n"
		"so.v.mv u1, u2, p0 \n\t"
		"so.b.nc u2, .uve_loop%= \n\t" :::);
}
#endif // RUN_UVE


#ifdef RUN_SIMPLE
void core(DataType dest[SIZE], DataType src[SIZE]) {
  for (int i = 0; i < SIZE; i++) {
    dest[i] = src[i];
  }
}
#endif // RUN_SIMPLE


#ifdef RUN_CLAVA
void core(DataType dest[SIZE], DataType src[SIZE]) {
  #pragma clava data uve : true
  for (int i = 0; i < SIZE; i++) {
    dest[i] = src[i];
  }
}
#endif // RUN_CLAVA


#ifdef RUN_BLANK
void core(DataType dest[SIZE], DataType src[SIZE]) {
}
#endif // RUN_BLANK
