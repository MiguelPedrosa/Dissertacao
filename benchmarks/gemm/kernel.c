#include "Commun.h"



#ifdef RUN_UVE
  #error "Trying to run original UVE version. This contained instructions not present in spike"
#endif // RUN_UVE


#ifdef RUN_SIMPLE
void core(DataType A[SIZE], DataType B[SIZE], DataType C[SIZE], DataType alpha, DataType beta) {
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
#endif // RUN_SIMPLE


#ifdef RUN_CLAVA
void core(DataType A[SIZE], DataType B[SIZE], DataType C[SIZE], DataType alpha, DataType beta) {
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
#endif // RUN_CLAVA


#ifdef RUN_BLANK
void core(DataType A[SIZE], DataType B[SIZE], DataType C[SIZE], DataType alpha, DataType beta) {
}
#endif // RUN_BLANK
