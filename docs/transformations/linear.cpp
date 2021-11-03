
void core_kernel(float* src1, float* src2, int sizeN, float A) {
  for (int i = 0; i < sizeN; i++) {
    src1[i] += src2[i] * A;
  }
}

void core_kernel_v2(float* src1, float* src2, int sizeN, float A) {
  for (int i = 0; i < sizeN; i++) {
    src1[i] = src1[i] + (src2[i] * A);
  }
}

void core_kernel_v3(float* src1, float* src2, int sizeN, float A) {
  for (int i = 0; i < sizeN; i++) {
    float a4 = A; // read broadcast
    float a3 = src2[i]; // read
    float a2 = src1[i]; // read
    float *a1 = &src1[i]; // write
    *a1 = a2 + (a3 * a4);
  }
}

void core_kernel_v4(float* src1, float* src2, int sizeN, float A) {
  for (int i = 0; i < sizeN; i++) {
    float a4 = A; // read broadcast
    float a3 = src2[i]; // read
    float a2 = src1[i]; // read
    float *a1 = &src1[i]; // write

    float temp1 = a3 * a4;
    *a1 = a2 + temp1;
  }
}
