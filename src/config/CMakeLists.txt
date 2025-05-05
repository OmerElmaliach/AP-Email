# DEFINE FILES TO COMPILE TO TESTS.

cmake_minimum_required(VERSION 3.14)
project(AP_Email)

set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_STANDARD_REQUIRED ON)

include(FetchContent)
FetchContent_Declare(
  googletest
  URL https://github.com/google/googletest/archive/03597a01ee50ed33e9dfd640b249b4be3799d395.zip
)
# For Windows: Prevent overriding the parent project's compiler/linker settings
set(gtest_force_shared_crt ON CACHE BOOL "" FORCE)
FetchContent_MakeAvailable(googletest)

add_executable(runTests
    ../tests/test.cpp
    ../datatypes/app.cpp
    ../datatypes/bloomFilterStorage.cpp
    ../datatypes/fileStorage.cpp
    ../datatypes/CheckURLCommand.cpp
    ../datatypes/AddURLCommand.cpp
    ../datatypes/cli.cpp
    ../datatypes/MyHash.cpp
)

# Include a path to header files.
target_include_directories(runTests PRIVATE
    ${CMAKE_CURRENT_SOURCE_DIR}/../datatypes/include
)

target_link_libraries(runTests gtest_main)

