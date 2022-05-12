#include <stdio.h>
#include "Commun.h"


extern void core(DataType L[SIZE], DataType b[SIZE], DataType x[SIZE]);

int main() {
  float L[SIZE][SIZE];
  float b[SIZE];
  float x[SIZE];

  initArray(L);
  initArray(b);
  initArray(x);

  core_kernel(L, b, x);

  for (int i = 0; i < SIZE; i++) {
    printf( DataFormat("", "\n"), x[i]);
  }

  return 0;
}
