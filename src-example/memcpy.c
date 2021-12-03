#include <stdint.h>


void core_kernel(float **path, int N) {
  #pragma clava data uve : true
  for (int k = 0; k < N; k++) {
    for (int i = 0; i < N; i++) {
      for (int j = 0; j < N; j++) {
        path[i][j] = path[i][j] < path[i][k] + path[k][j]
                         ? path[i][j]
                         : path[i][k] + path[k][j];
      }
    }
  }
}
