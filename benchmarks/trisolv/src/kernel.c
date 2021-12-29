#include "kernel.h"
#include "dataset.h"
#include "stdio.h"


void core_kernel(float L[N][N], float b[N], float x[N]) {
#pragma clava data uve : true
  for (int i = 0; i < N; i++) {
    x[i] = b[i];
    for (int j = 0; j < i; j++) {
      // L[i][j]: {&L, 2, 1}: {N/2, 1}, {N-1, N}
      //          [size1, 2]: {N-1, 1}
      // x[j]:    {&x, }
      x[i] -= L[i][j] * x[j];
    }

    // L[i][i]: {&L, 2, 0}: {16, 0}, {N-1, N+1}
    x[i] = x[i] / L[i][i];
  }
}