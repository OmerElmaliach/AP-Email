#include <gtest/gtest.h>
#include <cli.h"
#include <Icommand.h>
#include <string>
using namespace std;

class TestCommand : public Icommand {
    std::string executeCommand(const std::string& URL) {
        return "Works!"
    }
}


CLI* cmdMenu = new CLI();
// Should pass if run() function was executed.
TEST(CLITest, runMethod) {
    EXPECT_NO_THROW(cmdMenu.run());
}

// Format tests {Number} {URL}
TEST(CLITest, checkRegexWrongFormat) {
    EXPECT_TRUE(cmdMenu.checkRegex("2 www.example.com0"));
    EXPECT_TRUE(cmdMenu.checkRegex("ABCD"));
    EXPECT_TRUE(cmdMenu.checkRegex("2 www.example.com0"));
    EXPECT_TRUE(cmdMenu.checkRegex("1 https://www.example.com"));
    EXPECT_TRUE(cmdMenu.checkRegex("2 http://example.co.il"));
    EXPECT_TRUE(cmdMenu.checkRegex("1 https://example.com/path"));
    EXPECT_TRUE(cmdMenu.checkRegex("2 http://www.example.org"));
    EXPECT_TRUE(cmdMenu.checkRegex("1 example.org"));
    EXPECT_TRUE(cmdMenu.checkRegex("2 example.co.il"));
    EXPECT_TRUE(cmdMenu.checkRegex("2 https://example.co.il/test"));
    EXPECT_TRUE(cmdMenu.checkRegex("2             www.google.com     "));

    EXPECT_FALSE(cmdMenu.checkRegex("THIS_IS_A_TEST"));
    EXPECT_FALSE(cmdMenu.checkRegex("www.example.com0"));
    EXPECT_FALSE(cmdMenu.checkRegex("1 htp://example.com"));
    EXPECT_FALSE(cmdMenu.checkRegex("1 http://.com"));
    EXPECT_FALSE(cmdMenu.checkRegex("1 www..com"));
    EXPECT_FALSE(cmdMenu.checkRegex("1 example"));
    EXPECT_FALSE(cmdMenu.checkRegex("1 http://example"));
    EXPECT_FALSE(cmdMenu.checkRegex("1 http://example.c"));
    EXPECT_FALSE(cmdMenu.checkRegex("1 example.c"));
    EXPECT_FALSE(cmdMenu.checkRegex("1 http://exa_mple.com"));
}


// Test adding commands to the map.
TEST(CLITest, registerCommand) {
    ICommand* ic = new ICommand();
    EXPECT_NO_THROW(cmdMenu.registerCommand("NEW1", ic));
    EXPECT_NO_THROW(cmdMenu.registerCommand("NEW2", ic));
    EXPECT_NO_THROW(cmdMenu.registerCommand("NEW1", ic)); // Handles duplications.
    EXPECT_THROW(cmdMenu.registerCommand(2, ic));
    delete ic;
}

// Test executing commands using the map.
TEST(CLITest, executeCommand) {
    ICommand* ic = new TestCommand();
    cmdMenu.registerCommand("Test", ic);
    EXPECT_EQ(cmdMenu.executeCommand("Test"), "Works!");
    delete ic;
}

// Test the is running method, should be true if exit was not called.
TEST(CLITest, isRunning) {
    EXPECT_TRUE(cmdMenu.isRunning());
}

// Test the exit function, should only change m_menuState for CLI.
TEST(CLITest, exitCMD) {
    EXPECT_NO_THROW(cmdMenu.exit());
    EXPECT_FALSE(cmdMenu.isRunning());
}


int main(int argc, char **argv) {
    ::testing::InitGoogleTest(&argc, argv);
    return RUN_ALL_TESTS();
}