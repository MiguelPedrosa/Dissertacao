#include "Commun.h"



#ifdef RUN_UVE
  #error "Trying to run original UVE version. This contained instructions not present in spike"
#endif // RUN_UVE


#ifdef RUN_SIMPLE
void core(DataType path[SIZE][SIZE]) {
  for (int i = 0; i < SIZE; i++) {
    for (int j = 0; j < SIZE; j++) {
      path[i][j] = 0;
    }
    for (int k = 0; k < SIZE; k++) {
      for (int j = 0; j < SIZE; j++) {
        path[i][j] += path[i][k] * path[k][j];
      }
    }
  }
}
#endif // RUN_SIMPLE


#ifdef RUN_CLAVA
void core(DataType path[SIZE][SIZE]) {
#pragma clava data uve : true
  for (int i = 0; i < SIZE; i++) {
    for (int j = 0; j < SIZE; j++) {
      path[i][j] = 0;
    }
    for (int k = 0; k < SIZE; k++) {
      for (int j = 0; j < SIZE; j++) {
        path[i][j] += path[i][k] * path[k][j];
      }
    }
  }
}
#endif // RUN_CLAVA


#ifdef RUN_BLANK
void core(DataType path[SIZE]) {
}
#endif // RUN_BLANK
