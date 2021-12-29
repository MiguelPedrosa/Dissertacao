#include "dataset.h"
#include "kernel.h"
#include <stdio.h>
#include <stdlib.h>


int main() {
  float L[N][N] = dataset_L;
  float b[N] = dataset_b;
  float x[N] = dataset_x;


  core_kernel(L, b, x);

  for (int i = 0; i < N; i++) {
    printf("%f\n", x[i]);
  }

  return 0;
}