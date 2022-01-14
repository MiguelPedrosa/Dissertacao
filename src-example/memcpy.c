#include <stdint.h>


void core_kernel(uint16_t** C, uint16_t** B, uint16_t** A, int sizeI, int sizeJ, int sizeK) {
  int beta = 23;
  int alpha = 14;

  #pragma clava data kernel.json
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
