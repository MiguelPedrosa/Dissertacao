#include "dataset.h"
#include "kernel.h"
#include "stdio.h"


void core_kernel(float path[N][N], int size) {

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