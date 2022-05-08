#include "Commun.h"


void initArray(DataType array[SIZE]) {
  const DataType values[] = DataSet;

  for (int i = 0; i < SIZE; i++) {
    array[i] = values[i];
  }
}

void initZero(DataType array[SIZE]) {
  for (int i = 0; i < SIZE; i++) {
    array[i] = 0;
  }
}