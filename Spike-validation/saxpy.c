#include <stdio.h>
#include "Commun.h"


#ifdef UVE_RUN

void uve_config(DataType dest[SIZE], DataType src[SIZE], DataType value) {
  asm volatile(
    "ss.ld.d u1, %[src1], %[size], %[stride] \t\n"
    "ss.ld.d u2, %[src2], %[size], %[stride] \t\n"
    "ss.st.d u3, %[dest], %[size], %[stride] \t\n"
    "so.v.dp.d u4, %[value], p0\t\n"
    :: [src1] "r"(src),
      [src2] "r"(dest),
      [dest] "r"(dest),
      [size] "r"(SIZE),
      [stride] "r" (1),
      [value] "r" (value));
}

void uve_loop(){
	asm volatile(
		"Loop: \t\n"
    "so.a.mul.fp u5, u1, u4, p0\n\t"
    "so.a.add.fp u3, u2, u5, p0 \n\t"
    "so.b.nc u1, Loop \n\t");
}

#else // non UVE_RUN

void core(DataType dest[SIZE], DataType src[SIZE], DataType A) {
  for (int i = 0; i < SIZE; i++) {
    dest[i] += src[i] * A;
  }
}

#endif // UVE_RUN


int main()
{
  DataType src[SIZE];
  DataType dest[SIZE];
  DataType value = 3.f;

  initArray(src);
  initArray(dest);

#ifdef UVE_RUN
  uve_config(dest, src, value);
  uve_loop();
#else
  core(dest, src, value);
#endif

  for (int i = 0; i < SIZE; i++)
    printf( DataFormat("", "\n"), dest[i]);
}