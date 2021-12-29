#include <stdint.h>


void core_kernel(uint16_t *src, uint16_t*dest, int sizeN) {

  #pragma clava data kernel.json
  for (int i = 0; i < sizeN; i++) {
    dest[i] = src[i];
  }

}
