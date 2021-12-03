#include "dataset.h"
#include "kernel.h"
#include <stdio.h>
#include <stdlib.h>

int main() {
  float dest[N] = dest_dataset;
  float src[N] = src_dataset;
  float A = 2.f;

  core_kernel(dest, src, N, A);

  for (int i = 0; i < N; i++) {
    printf("%f\n", dest[i]);
  }

  return 0;
}