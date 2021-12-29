#include "dataset.h"

void core_kernel(float[SIZE_I][SIZE_K], float[SIZE_K][SIZE_J],
                 float[SIZE_I][SIZE_J], float, float, int, int, int);