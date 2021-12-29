#include "kernel.h"
#include "dataset.h"


void core_kernel(float data[N][M], float cov[M][M], float mean[M],
                 float float_n, int sizeM, int sizeN) {

#pragma clava data uve : true
  for (int j = 0; j < sizeM; j++) {
    mean[j] = 0.0;
    for (int i = 0; i < sizeN; i++) {
      mean[j] += data[i][j];
    }
    mean[j] /= float_n;
  }

#pragma clava data uve : true
  for (int i = 0; i < sizeN; i++) {
    for (int j = 0; j < sizeM; j++) {
      data[i][j] -= mean[j];
    }
  }
#pragma clava data uve : true
  for (int i = 0; i < sizeM; i++) {
    for (int j = i; j < sizeM; j++) {
      cov[i][j] = 0.0;
      for (int k = 0; k < sizeN; k++) {
        cov[i][j] += data[k][i] * data[k][j];
      }
      cov[i][j] /= (float_n - 1.0);
      cov[j][i] = cov[i][j];
    }
  }
}