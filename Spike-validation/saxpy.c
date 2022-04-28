#include <stdio.h>
#include "Commun.h"


#ifdef UVE_RUN

void uve_config(DataType dest[SIZE], DataType src[SIZE], DataType value) {
  asm volatile(
    "ss.ld.w  u1, %[src1], %[size], %[stride] \t\n"
    "ss.ld.w  u2, %[src2], %[size], %[stride] \t\n"
    "ss.st.w  u3, %[dest], %[size], %[stride] \t\n"
    "so.v.dp.w  u4, %[value], p0\t\n"
    :: [src1] "r"(src),
      [src2] "r"(dest),
      [size] "r"(SIZE),
      [stride] "r" (1),
      [value] "r" (value));
}

void uve_loop(){
	asm volatile(
		"Loop: \t\n"
    "so.a.mul.fp u5, u1, u4, p0\n\t"
    "so.a.add.fp u3, u2, u5, p0 \n\t"
    "so.b.nc	u1, fLoop1 \n\t"
	);
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

  initArray(src);
  initArray(dest);

#ifdef UVE_RUN
  uve_config(dest, src, 4.f);
  uve_loop();
#else
  core(dest, src, 4.f);
#endif

  for (int i = 0; i < SIZE; i++)
    printf( DataFormat("", "\n"), dest[i]);

}