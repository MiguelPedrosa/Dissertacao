#include "dataset.h"
#include "kernel.h"
#include <stdio.h>
#include <stdint.h>


void core_kernel(float dest[N], float src[N], uint64_t size, float A) {
  #pragma clava data uve : true
    for (int i = 0; i < size; i++) {
        dest[i] += src[i] * A;
    }
}