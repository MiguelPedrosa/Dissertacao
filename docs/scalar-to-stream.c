#include <stdint.h>


void uve_memcpy_double(void *dest, void *src, uint64_t size) {
  uint64_t stride = 1;
  asm volatile("ss.st.d  u10, %[x], %[y], %[z] \t\n"
               "ss.ld.d  u11, %[w], %[y], %[z] \t\n"
               :
               : [x] "r"(dest), [w] "r"(src), [y] "r"(size), [z] "r"(stride));
  return;
}
void uve_memcpy_half(void *dest, void *src, uint64_t size) {
  uint64_t stride = 1;
  asm volatile("ss.st.h  u10, %[x], %[y], %[z] \t\n"
               "ss.ld.h  u11, %[w], %[y], %[z] \t\n"
               :
               : [x] "r"(dest), [w] "r"(src), [y] "r"(size), [z] "r"(stride));
  return;
}
void uve_memcpy_byte(void *dest, void *src, uint64_t size) {
  uint64_t stride = 1;
  asm volatile("ss.st.b  u10, %[x], %[y], %[z] \t\n"
               "ss.ld.b  u11, %[w], %[y], %[z] \t\n"
               :
               : [x] "r"(dest), [w] "r"(src), [y] "r"(size), [z] "r"(stride));
  return;
}
void uve_memcpy_word(void *dest, void *src, uint64_t size) {
  uint64_t stride = 1;
  asm volatile("ss.st.w  u10, %[x], %[y], %[z] \t\n"
               "ss.ld.w  u11, %[w], %[y], %[z] \t\n"
               :
               : [x] "r"(dest), [w] "r"(src), [y] "r"(size), [z] "r"(stride));
  return;
}

void uve_memcpy_loop(uint64_t sizeN) {
  for (uint64_t i = 0; i < sizeN; i++) {
    uint16_t _tmp_0;
    uint16_t _tmp_1;
    asm volatile(
      "so.v.mvvs %[x], u11"
      : [x] "=r"(_tmp_1)
    );
    _tmp_0 = _tmp_1;
    asm volatile(
      "so.v.mvsv.h u10, %[x]"
      :
      : [x] "r"(_tmp_0)
    );
  }
  return;
}

#include <string.h>
void core_memcpy(void *dest, void *src, uint64_t size) {
  // // Memcpy version
  // memcpy(dest, src, size);

  // For version
  uint8_t *_dest = (uint8_t *)dest;
  uint8_t *_src = (uint8_t *)src;
  for (uint64_t i = 0; i < size; i++) {
    _dest[i] = _src[i];
  }
}
