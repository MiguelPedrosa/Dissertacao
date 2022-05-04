#ifndef COMMUN_H
#define COMMUN_H

#include "Dataset.h"


/* Configure size of array and, as such, amount of operations */
#ifndef SIZE
#define SIZE 64
#endif

/* Becase we might wanna test differnt properties, we can define here a diferent build type */
// Using floats
#if TYPE == 1
#define DataType double
#define DataSet fDataset
#define DataFormat(start, end) start "%lf" end

// Using integers
#elif TYPE == 2
#define DataType long
#define DataSet iDataset
#define DataFormat(start, end) start "%d" end

#else
#error *Did not pass a type of value 1 or 2*
#endif // TYPE


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


#endif // COMMUN_H