
void core_kernel(float** src1, float** src2, int sizeN, float A) {
  for (int i = 0; i < sizeN; i++) {
    for (int j = 0; j < sizeN; j++) {
      src1[i][j] += src2[i][j] * A;
    }
  }
}


void core_kernel_v2(float** src1, float** src2, int sizeN, float A) {
  for (int i = 0; i < sizeN; i++) {
    for (int j = 0; j < sizeN; j++) {
      float temp = src2[i][j] * A;
      src1[i][j] = src1[i][j] + temp;
    }
  }
}


void core_kernel_v3(float** src1, float** src2, int sizeN, float A) {
  for (int i = 0; i < sizeN; i++) {
    for (int j = 0; j < sizeN; j++) {
      float s1 = src2[i][j];
      float s2 = src1[i][j];
      float* s3 = &src1[i][j];

      float temp = s1 * A;
      *s3 = s2 + temp;
    }
  }
}


...


void core_kernel_v4(float** src1, float** src2, int sizeN, float A) {
  Stream var1([=] {
    for (int i = 0; i < sizeN; i++)
      for (int j = 0; j < sizeN; j++)
        co_yield src2[i][j];
  });
  Stream var2([=] {
    for (int i = 0; i < sizeN; i++)
      for (int j = 0; j < sizeN; j++)
        co_yield src1[i][j];
  });
  Stream var3([=] {
    for (int i = 0; i < sizeN; i++)
      for (int j = 0; j < sizeN; j++)
        co_yield src1[i][j];
  });

  float s1 = var1.next();
  float s2 = var2.next();
  float s3 = var3.next();

  while (!var1.done()) {
    float temp = s1 * A;
    s3 = s2 + temp;

    s1 = var1.next();
    s2 = var2.next();
    s3 = var3.next();
  }
}
