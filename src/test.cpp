#include <gtest/gtest.h>
#include "datatypes/imenu.h"

// Should pass if an IMenu object was created.
TEST(IMenuTest, objectCreation) {
    IMenu menu = new IMenu();
    std::cout << "IMenu created\n";
    delete menu;
    std::cout << "IMenu destroyed\n";
}

int main(int argc, char **argv) {
    ::testing::InitGoogleTest(&argc, argv);
    return RUN_ALL_TESTS();
}