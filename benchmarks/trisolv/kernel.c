#include "Commun.h"



#ifdef RUN_UVE
  #error "Trying to run original UVE version. This contained instructions not present in spike"
#endif // RUN_UVE


#ifdef RUN_SIMPLE
void core(DataType L[SIZE][SIZE], DataType b[SIZE], DataType x[SIZE]) {
  for (int i = 0; i < SIZE; i++) {
    x[i] = b[i];
    for (int j = 0; j < i; j++) {
      x[i] -= L[i][j] * x[j];
    }
    x[i] = x[i] / L[i][i];
  }
}
#endif // RUN_SIMPLE


#ifdef RUN_CLAVA
void core(DataType L[SIZE][SIZE], DataType b[SIZE], DataType x[SIZE]) {
  #pragma clava data uve : true
  for (int i = 0; i < SIZE; i++) {
    x[i] = b[i];
    for (int j = 0; j < i; j++) {
      x[i] -= L[i][j] * x[j];
    }
    x[i] = x[i] / L[i][i];
  }
}
#endif // RUN_CLAVA


#ifdef RUN_BLANK
void core(DataType L[SIZE][SIZE], DataType b[SIZE], DataType x[SIZE]) {
}
#endif // RUN_BLANK
