#include <stdio.h>
#include "Commun.h"


extern void core(DataType A[SIZE], DataType B[SIZE], DataType ct);

int main()
{
  DataType A[SIZE];
  DataType B[SIZE];
  DataType ct = 0.33333;

  initArray(A);
  initArray(B);

  core(A, B, ct);

  for (int i = 0; i < SIZE; i++)
    printf( DataFormat("", "\n"), A[i]);
    printf( DataFormat("", "\n"), B[i]);
}
