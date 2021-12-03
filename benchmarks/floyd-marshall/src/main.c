#include "dataset.h"
#include "kernel.h"
#include <stdio.h>
#include <stdlib.h>

int main() {
	float path[N][N] = dataset;

  core_kernel(path, N);

  for (int i = 0; i < N; i++) {
    for (int j = 0; j < N; j++) {
      printf("%f\n", path[i][j]);
    }
  }

  return 0;
}