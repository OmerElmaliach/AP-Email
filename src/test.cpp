#include <gtest/gtest.h>
#include "datatypes/imenu.h"

class ICommand {
    
};

class DummyMenu : protected IMenu<int>
{
public:
    void run() override {}
    void registerCommand(int& n, ICommand& cmd) override {}
    void executeCommand(int& n) override {}
    bool isRunning() override { return true; }
    void exit() override {}
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