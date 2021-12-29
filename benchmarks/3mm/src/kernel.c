#include "kernel.h"
#include "dataset.h"
#include "stdio.h"

void core_kernel(float src1[I][J], float src2[I][K], float src3[K][J],
                 int sizeI, int sizeJ, int sizeK) {

#pragma clava data uve : true
  for (int i = 0; i < sizeI; i++) {
    for (int j = 0; j < sizeJ; j++) {
      src1[i * sizeJ + j] = 0;
    }
    for (int k = 0; k < sizeK; k++) {
      for (int j = 0; j < sizeJ; j++) {
        src1[i * sizeJ + j] += src2[i * sizeK + k] * src3[k * sizeJ + j];
      }
    }
  }
}