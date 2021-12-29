#include "kernel.h"
#include "dataset.h"
#include "stdio.h"

void core_kernel(float A[SIZE_I][SIZE_K], float B[SIZE_K][SIZE_J],
                 float C[SIZE_I][SIZE_J], float alpha, float beta, int sizeI,
                 int sizeJ, int sizeK) {

#pragma clava data uve : true
  for (int i = 0; i < sizeI; i++) {
    for (int j = 0; j < sizeJ; j++) {
      C[i][j] *= beta;
    }
    for (int k = 0; k < sizeK; k++) {
      for (int j = 0; j < sizeJ; j++) {
        C[i][j] += alpha * A[i][k] * B[k][j];
      }
    }
  }
}