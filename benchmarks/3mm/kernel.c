#include "Commun.h"



#ifdef RUN_UVE
  #error "Trying to run original UVE version. This contained instructions not present in spike"
#endif // RUN_UVE


#ifdef RUN_SIMPLE
void core(DataType path[SIZE]) {
  for (int i = 0; i < sizeI; i++) {
    for (int j = 0; j < sizeJ; j++) {
      src1[i][j] = 0;
    }
    for (int k = 0; k < sizeK; k++) {
      for (int j = 0; j < sizeJ; j++) {
        src1[i][j] += src2[i][k] * src3[k][j];
      }
    }
  }
}
#endif // RUN_SIMPLE


#ifdef RUN_CLAVA
void core(DataType path[SIZE]) {
#pragma clava data uve : true
  for (int i = 0; i < sizeI; i++) {
    for (int j = 0; j < sizeJ; j++) {
      src1[i][j] = 0;
    }
    for (int k = 0; k < sizeK; k++) {
      for (int j = 0; j < sizeJ; j++) {
        src1[i][j] += src2[i][k] * src3[k][j];
      }
    }
  }
}
#endif // RUN_CLAVA


#ifdef RUN_BLANK
void core(DataType path[SIZE]) {
}
#endif // RUN_BLANK
