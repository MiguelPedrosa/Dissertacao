#include <stdio.h>
#include "Commun.h"


#ifdef UVE_RUN

void uve_config(DataType dest[SIZE], DataType src[SIZE]) {
	asm volatile(
		"ss.st.d  u1, %[dest], %[size], %[stride] \t\n"
		"ss.ld.d  u2,  %[src], %[size], %[stride] \t\n"
		:: [dest] "r" (dest),
      [src] "r" (src),
      [size] "r" (SIZE),
      [stride] "r" (1));
}

void uve_loop(){
	asm volatile(
		"Loop: \t\n"
		"so.v.mv u1, u2, p0 \n\t"
		"so.b.nc	u2, Loop \n\t");
}

#else // non UVE_RUN

void core(DataType dest[SIZE], DataType src[SIZE]) {
  for (int i = 0; i < SIZE; i++) {
    dest[i] = src[i];
  }
}

#endif // UVE_RUN


int main()
{
  DataType src[SIZE];
  DataType dest[SIZE];

  initArray(src);
  initZero(dest);

#ifdef UVE_RUN
  uve_config(dest, src);
  uve_loop();
#else
  core(dest, src);
#endif

  for (int i = 0; i < SIZE; i++)
    printf( DataFormat("", "\n"), dest[i]);
}