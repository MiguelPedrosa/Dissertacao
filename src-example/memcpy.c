#include <stdint.h>


void core_kernel(float *src, float *dest, int sizeN) {

  #pragma clava data kernel.json
  for (int i = 0; i < sizeN; i++) {
    dest[i] = src[i];
  }

//   #pragma clava data uve: true
// // stream u1 -> src[i]
// // stream u2 -> dest[i]
//   for (int i = 0; i < sizeN; i++) {
//     float tmp1, tmp2;
//     asm volatile("mov x, u1" : x "r" (tmp1));
//     tmp2 = tmp1;
//     asm volatile("mov u2, x" : x "r" (tmp2));
//   }
}
