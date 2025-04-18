#include <gtest/gtest.h>
#include "datatypes/imenu"

class DummyMenu : protected IMenu
{
public:
    void registerCommand(int n, ICommand& cmd) {}
    void executeCommand(int n) {}
};

// Should pass if an IMenu object was created.
TEST(IMenuTest, objectCreation) {
    DummyMenu* menu = new DummyMenu();
    std::cout << "IMenu created\n";
    delete menu;
    std::cout << "IMenu destroyed\n";
}

int main(int argc, char **argv) {
    ::testing::InitGoogleTest(&argc, argv);
    return RUN_ALL_TESTS();
}