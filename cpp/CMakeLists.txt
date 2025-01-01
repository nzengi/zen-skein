cmake_minimum_required(VERSION 3.13)
project(skein3_wasm)

set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_STANDARD_REQUIRED ON)

# Include ana proje header'ları
include_directories(${CMAKE_SOURCE_DIR}/../../include)

add_executable(skein3 skein3.cpp
    ../../src/threefish3.cpp
    ../../src/ai_protection.cpp
    ../../src/blockchain_features.cpp
    ../../src/performance_metrics.cpp)

set_target_properties(skein3 PROPERTIES 
    LINK_FLAGS "-s WASM=1 -s EXPORTED_RUNTIME_METHODS=['ccall','cwrap'] -s EXPORTED_FUNCTIONS=['_malloc','_free'] -s ALLOW_MEMORY_GROWTH=1") 