#include "Commun.h"



#ifdef RUN_UVE
  #error "Trying to run original UVE version. This contained instructions not present in spike"
#endif // RUN_UVE


#ifdef RUN_SIMPLE
void core_kernel(float path[SIZE][SIZE], int size) {
  for (int k = 0; k < size; k++) {
    for (int i = 0; i < size; i++) {
      for (int j = 0; j < size; j++) {
        path[i][j] = path[i][j] < path[i][k] + path[k][j]
                         ? path[i][j]
                         : path[i][k] + path[k][j];
      }
    }
  }
}
#endif // RUN_SIMPLE


#ifdef RUN_CLAVA
void core_kernel(float path[SIZE][SIZE], int size) {
  #pragma clava data uve : true
  for (int k = 0; k < size; k++) {
    for (int i = 0; i < size; i++) {
      for (int j = 0; j < size; j++) {
        path[i][j] = path[i][j] < path[i][k] + path[k][j]
                         ? path[i][j]
                         : path[i][k] + path[k][j];
      }
    }
  }
}
#endif // RUN_CLAVA


#ifdef RUN_BLANK
void core(DataType dest[SIZE], DataType src[SIZE]) {
}
#endif // RUN_BLANK
