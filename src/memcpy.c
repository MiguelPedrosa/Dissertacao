#include <stdint.h>

#if defined (UVE_COMPILATION)

void uve_memcpy_word(void * dest, void * src, uint64_t size) {
	uint64_t stride = 1;
	asm volatile(
		"ss.st.w  u10, %[x], %[y], %[z] \t\n"
		"ss.ld.w  u11, %[w], %[y], %[z] \t\n"
		:
		: [x] "r" (dest), [w] "r" (src), [y] "r" (size), [z] "r" (stride)
	);
	return;
}

void uve_memcpy_double(void * dest, void * src, uint64_t size) {
	uint64_t stride = 1;
	asm volatile(
		"ss.st.d  u10, %[x], %[y], %[z] \t\n"
		"ss.ld.d  u11, %[w], %[y], %[z] \t\n"
		:
		: [x] "r" (dest), [w] "r" (src), [y] "r" (size), [z] "r" (stride)
	);
	return;
}

void uve_memcpy_half(void * dest, void * src, uint64_t size) {
	uint64_t stride = 1;
	asm volatile(
		"ss.st.h  u10, %[x], %[y], %[z] \t\n"
		"ss.ld.h  u11, %[w], %[y], %[z] \t\n"
		:
		: [x] "r" (dest), [w] "r" (src), [y] "r" (size), [z] "r" (stride)
	);
	return;
}

void uve_memcpy_byte(void * dest, void * src, uint64_t size) {
	uint64_t stride = 1;
	asm volatile(
		"ss.st.b  u10, %[x], %[y], %[z] \t\n"
		"ss.ld.b  u11, %[w], %[y], %[z] \t\n"
		:
		: [x] "r" (dest), [w] "r" (src), [y] "r" (size), [z] "r" (stride)
	);
	return;
}

void uve_memcpy_loop(){
	asm volatile(
		"Loop: \t\n"
		"so.v.mv u10, u11, p0 \n\t"
		"so.b.nc	u11, Loop \n\t"
	);
	return;
}

#else

void core_kernel(char *dest, char *src, int size) {
	#define u1 dest[i]
	#define u2  src[i]

	#pragma clava data kernel.json
	for (int i = 0; i < size; i++) {
		u1 = u2;
	}
}

#endif