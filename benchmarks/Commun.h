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


void initArray(DataType array[SIZE]);
void initArray2D(DataType array[SIZE][SIZE]);

void initZero(DataType array[SIZE]);


#endif // COMMUN_H