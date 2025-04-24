#include <gtest/gtest.h>
#include "datatypes/app.h"

// Should pass if an IMenu object was created.
TEST(AppTest, objectCreation) {
    App* app = new App();
    std::cout << "App created\n";
    delete app;
    std::cout << "App destroyed\n";
}

int main(int argc, char **argv) {
    ::testing::InitGoogleTest(&argc, argv);
    return RUN_ALL_TESTS();
}