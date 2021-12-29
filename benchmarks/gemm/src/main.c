#include "dataset.h"
#include "kernel.h"
#include <stdio.h>
#include <stdlib.h>

int main() {
  float A[SIZE_I][SIZE_K] = DATASET_A;
  float B[SIZE_K][SIZE_J] = DATASET_B;
  float C[SIZE_I][SIZE_J] = DATASET_C;
  float alpha = ALPHA;
  float beta = BETA;

  core_kernel(A, B, C, alpha, beta, SIZE_I, SIZE_J, SIZE_K);

  for (int i = 0; i < SIZE_I; i++) {
    for (int j = 0; j < SIZE_J; j++) {
      printf("%f\n", C[i][j]);
    }
  }

  return 0;
}