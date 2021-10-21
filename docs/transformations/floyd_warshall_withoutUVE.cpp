#include <functional>

template<typename Datatype> struct Stream {
  using ExprType = std::function<Datatype()>;

  Stream(ExprType expr)
    : generator{expr}
  {}
  Datatype next() {
    return generator();
  }
  ExprType generator;
};

#define MIN(a, b) (a < b ? a : b)


// Original Code
void core_kernel(float* src1, unsigned int sizeN) {
  for (int k = 0; k < sizeN; k++) {
    for(int i = 0; i < sizeN; i++) {
      for (int j = 0; j < sizeN; j++) {
        src1[i*sizeN+j] = src1[i*sizeN+j] < src1[i*sizeN+k] + src1[k*sizeN+j]
                          ? src1[i*sizeN+j]
                          : src1[i*sizeN+k] + src1[k*sizeN+j];
      }
    }
  }
}

// Remove syntatic sugar (explicitly write +=, -=, ?:, etc. operators)
void core_kernel_v1(float* src1, unsigned int sizeN) {
  for (int k = 0; k < sizeN; k++) {
    for(int i = 0; i < sizeN; i++) {
      for (int j = 0; j < sizeN; j++) {
        if (src1[i*sizeN+j] < src1[i*sizeN+k] + src1[k*sizeN+j]) {
          src1[i*sizeN+j] = src1[i*sizeN+j];
        } else {
          src1[i*sizeN+j] = src1[i*sizeN+k] + src1[k*sizeN+j];
        }
      }
    }
  }
}

// Isolate all memory accesses
void core_kernel_v2(float* src1, unsigned int sizeN) {
  for (int k = 0; k < sizeN; k++) {
    for(int i = 0; i < sizeN; i++) {
      for (int j = 0; j < sizeN; j++) {
        float  s1 =  src1[i*sizeN+j];
        float  s2 =  src1[i*sizeN+k];
        float  s3 =  src1[k*sizeN+j];
        float* s4 = &src1[i*sizeN+j];
        float  s5 =  src1[i*sizeN+j];
        float* s6 = &src1[i*sizeN+j];
        float  s7 =  src1[i*sizeN+k];
        float  s8 =  src1[k*sizeN+j];

        if (s1 < s2 + s3) {
          *s4 = s5;
        } else {
          *s6 = s7 + s8;
        }
      }
    }
  }
}

// Identify common access patterns where values are equal
void core_kernel_v3(float* src1, unsigned int sizeN) {
  for (int k = 0; k < sizeN; k++) {
    for(int i = 0; i < sizeN; i++) {
      for (int j = 0; j < sizeN; j++) {
        float  s1 =  src1[i*sizeN+j];
        float  s2 =  src1[i*sizeN+k];
        float  s3 =  src1[k*sizeN+j];
        float* s4 = &src1[i*sizeN+j];
        float  s5 =  s1;
        float* s6 =  s4;
        float  s7 =  s2;
        float  s8 =  s3;

        if (s1 < s2 + s3) {
          *s4 = s5;
        } else {
          *s6 = s7 + s8;
        }
      }
    }
  }
}

// Replace common accesses with single variable
void core_kernel_v4(float* src1, unsigned int sizeN) {
  for (int k = 0; k < sizeN; k++) {
    for(int i = 0; i < sizeN; i++) {
      for (int j = 0; j < sizeN; j++) {
        float  s1 =  src1[i*sizeN+j];
        float  s2 =  src1[i*sizeN+k];
        float  s3 =  src1[k*sizeN+j];
        float* s4 = &src1[i*sizeN+j];

        if (s1 < s2 + s3) {
          *s4 = s1;
        } else {
          *s4 = s2 + s3;
        }
      }
    }
  }
}

// Replace all variable uses with temporaries
void core_kernel_v5(float* src1, unsigned int sizeN) {
  for (int k = 0; k < sizeN; k++) {
    for(int i = 0; i < sizeN; i++) {
      for (int j = 0; j < sizeN; j++) {
        float  s1 =  src1[i*sizeN+j];
        float  s2 =  src1[i*sizeN+k];
        float  s3 =  src1[k*sizeN+j];
        float* s4 = &src1[i*sizeN+j];
        float  t1 = s1;
        float  t2 = s2;
        float  t3 = s3;
        float  t4; // s4;

        if (t1 < t2 + t3) {
          t4 = t1;
        } else {
          t4 = t2 + t3;
        }
        *s4 = t4;
      }
    }
  }
}

// With optimizations (Maybe)
void core_kernel_v6(float* src1, unsigned int sizeN) {
  for (int k = 0; k < sizeN; k++) {
    for(int i = 0; i < sizeN; i++) {
      for (int j = 0; j < sizeN; j++) {
        float  s1 =  src1[i*sizeN+j];
        float  s2 =  src1[i*sizeN+k];
        float  s3 =  src1[k*sizeN+j];
        float* s4 = &src1[i*sizeN+j];
        float  t1 = s1;
        float  t2 = s2;
        float  t3 = s3;
        float  t4;

        float t5 = t2 + t3; // CSE
        if (t1 < t5) { 
          t4 = t1;
        } else {
          t4 = t5;
        }

        *s4 = t4;
      }
    }
  }
}

// With optimizations (Maybe)
void core_kernel_v7(float* src1, unsigned int sizeN) {
  for (int k = 0; k < sizeN; k++) {
    for(int i = 0; i < sizeN; i++) {
      for (int j = 0; j < sizeN; j++) {
        float  s1 =  src1[i*sizeN+j];
        float  s2 =  src1[i*sizeN+k];
        float  s3 =  src1[k*sizeN+j];
        float* s4 = &src1[i*sizeN+j];
        float  t1 = s1;
        float  t2 = s2; // Becomes dead variable
        float  t3 = s3; // Becomes dead variable
        float  t4;

        float t5 = s2 + s3;
        if (t1 < t5) {
          t4 = t1;
        } else {
          t4 = t5;
        }

        *s4 = t4;
      }
    }
  }
}

// With optimizations (Maybe)
void core_kernel_v8(float* src1, unsigned int sizeN) {
  for (int k = 0; k < sizeN; k++) {
    for(int i = 0; i < sizeN; i++) {
      for (int j = 0; j < sizeN; j++) {
        float  s1 =  src1[i*sizeN+j];
        float  s2 =  src1[i*sizeN+k];
        float  s3 =  src1[k*sizeN+j];
        float* s4 = &src1[i*sizeN+j];
        float  t1 = s1;
        float  t4;

        float t5 = s2 + s3;
        t4 = MIN(t1, t5);

        *s4 = t4;
      }
    }
  }
}

// With optimizations (Maybe)
void core_kernel_v9(float* src1, unsigned int sizeN) {
  for (int k = 0; k < sizeN; k++) {
    for(int i = 0; i < sizeN; i++) {
      for (int j = 0; j < sizeN; j++) {
        float  s1 =  src1[i*sizeN+j];
        float  s2 =  src1[i*sizeN+k];
        float  s3 =  src1[k*sizeN+j];
        float* s4 = &src1[i*sizeN+j];
        float  t1 = s1; // Becomes dead variable
        float  t4;      // Becomes dead variable

        float t5 = s2 + s3;
        t4 = MIN(s1, t5);

        *s4 = t4; // No longer needed
      }
    }
  }
}

// With optimizations (Maybe)
void core_kernel_v10(float* src1, unsigned int sizeN) {
  for (int k = 0; k < sizeN; k++) {
    for(int i = 0; i < sizeN; i++) {
      for (int j = 0; j < sizeN; j++) {
        float  s1 =  src1[i*sizeN+j];
        float  s2 =  src1[i*sizeN+k];
        float  s3 =  src1[k*sizeN+j];
        float* s4 = &src1[i*sizeN+j];

        float t5 = s2 + s3;
        *s4 = MIN(s1, t5);

        // *s4 = t4; // No longer needed
      }
    }
  }
}

// Convertion without optimizing
void core_kernel_v11(float* src1, unsigned int sizeN) {
  Stream<float> s1([&] {
    for (int k = 0; k < sizeN; k++)
      for (int i = 0; i < sizeN; i++)
        for (int j = 0; j < sizeN; j++)
          co_yield src1[i*sizeN+j];
    });
  Stream<float> s2([&] {
    for (int k = 0; k < sizeN; k++)
      for (int i = 0; i < sizeN; i++)
        for (int j = 0; j < sizeN; j++)
          co_yield src1[i*sizeN+k];
    });
  Stream<float> s3([&] {
    for (int k = 0; k < sizeN; k++) {
      for (int i = 0; i < sizeN; i++) {
        for (int j = 0; j < sizeN; j++) {
          co_yield src1[k*sizeN+j];
    });
  Stream<float> s4([&] {
    for (int k = 0; k < sizeN; k++) {
      for (int i = 0; i < sizeN; i++) {
        for (int j = 0; j < sizeN; j++) {
          co_yield &src1[i*sizeN+j];
    });

  while (!s1.done()) {
    float t1 = s1.next();
    float t2 = s2.next();
    float t3 = s3.next();
    float t4; // s4;
    if (t1 < t2 + t3) {
      t4 = t1;
    } else {
      t4 = t2 + t3;
    }
    *s4.next() = t4;
  }
}
