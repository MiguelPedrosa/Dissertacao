#include "dataset.h"
#include "kernel.h"
#include <stdio.h>


int main()
{
  float data[N][M] = DATASET_data;
  float cov[M][M];
  float mean[M];
  float float_n = (float) N;

  core_kernel(data, cov, mean, float_n, M, N);

  for (int i = 0; i < M; i++) {
    for (int j = 0; j < M; j++) {
      printf("%f\n", cov[i][j]);
    }
  }

  return 0;
}