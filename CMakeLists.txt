cmake_minimum_required(VERSION 3.0)

project(run-uve VERSION 1.0)

find_package(Clava REQUIRED)

set(CMAKE_C_STANDARD 11)
set(CMAKE_C_STANDARD_REQUIRED True)

set(SRC src/memcpy.c)

add_executable(run-uve "${SRC}")

target_include_directories(run-uve PUBLIC ${CMAKE_CURRENT_SOURCE_DIR})

clava_weave(run-uve src-lara/Main.lara ARGS "OUT_DIR:'./output'"  FLAGS -i "../src-lara")
