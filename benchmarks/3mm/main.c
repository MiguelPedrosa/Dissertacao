#include <stdio.h>
#include "Commun.h"


extern void core(DataType dest[SIZE]);

int main() {
	DataType path[SIZE][SIZE];

  initArray(path);

  core(path, SIZE);

  for (int i = 0; i < SIZE; i++) {
    for (int j = 0; j < SIZE; j++) {
      printf( DataFormat("", "\n"), path[i][j]);
    }
  }

  return 0;
}