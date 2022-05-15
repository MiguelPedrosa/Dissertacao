#include <stdio.h>
#include "Commun.h"


extern void core(DataType L[SIZE][SIZE], DataType b[SIZE], DataType x[SIZE]);

int main() {
  double L[SIZE][SIZE];
  double b[SIZE];
  double x[SIZE];

  initArray2D(L);
  initArray(b);
  initArray(x);

  core(L, b, x);

  for (int i = 0; i < SIZE; i++) {
    printf( DataFormat("", "\n"), x[i]);
  }

  return 0;
}
