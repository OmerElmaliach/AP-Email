#include <gtest/gtest.h>
#include "datatypes/cli.cpp"
#include "datatypes/icommand.cpp"
using namespace std;


// Should pass if run() function was executed.
TEST(CLITest, runMethod) {
    CLI* cmdMenu = new CLI();
    EXPECT_NO_THROW(cmdMenu.run());
    delete cmdMenu;
}

// Non numeric first input line.
TEST(CLITest, checkInputFirstLineLetters) {
    CLI* cmdMenu = new CLI();
    EXPECT_FALSE(cmdMenu.checkInput("THIS_IS_A_TEST"));
    delete cmdMenu;
}

// Mixture of numbers and letters.
TEST(CLITest, checkInputFirstLineMixture) {
    CLI* cmdMenu = new CLI();
    EXPECT_FALSE(cmdMenu.checkInput("8adf2 1 2"));
    EXPECT_FALSE(cmdMenu.checkInput("8 a34 64"));
    EXPECT_FALSE(cmdMenu.checkInput("8 1 1 3 f1"));
    delete cmdMenu;
}

// Numeric first input line.
TEST(CLITest, checkInputFirstLineNumbers) {
    CLI* cmdMenu = new CLI();
    EXPECT_FALSE(cmdMenu.checkInput("8"));
    EXPECT_TRUE(cmdMenu.checkInput("8 6 3"));
    EXPECT_TRUE(cmdMenu.checkInput("1 2 3 4 5"));
    EXPECT_TRUE(cmdMenu.checkInput("45 4 246 6 4763 2 7"));
    delete cmdMenu;
}

// Format tests {Number} {URL}
TEST(CLITest, checkRegexWrongFormat) {
    CLI* cmdMenu = new CLI();
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
    delete cmdMenu;
}


// Test adding commands to the map.
TEST(CLITest, registerCommand) {
    CLI* cmdMenu = new CLI();
    ICommand* ic = new ICommand();
    EXPECT_NO_THROW(cmdMenu.registerCommand(1, ic));
    EXPECT_NO_THROW(cmdMenu.registerCommand(2, ic));
    EXPECT_NO_THROW(cmdMenu.registerCommand(1, ic)); // Handles duplications.
    EXPECT_THROW(cmdMenu.registerCommand("TEST", ic));
    delete ic;
    delete cmdMenu;
}

// Test executing commands using the map.
TEST(CLITest, executeCommand) {
    CLI* cmdMenu = new CLI();
    ICommand* ic = new ICommand();
    cmdMenu.registerCommand(1, ic);
    EXPECT_EQ(cmdMenu.executeCommand(1, NULL), "TEST");
    delete ic;
    delete cmdMenu;
}

// Test the is running method, should be true if exit was not called.
TEST(CLITest, isRunning) {
    CLI* cmdMenu = new CLI();
    EXPECT_TRUE(cmdMenu.isRunning());
    delete cmdMenu;
}

// Test the exit function, should only change m_menuState for CLI.
TEST(CLITest, exitCMD) {
    CLI* cmdMenu = new CLI();
    EXPECT_NO_THROW(cmdMenu.exit());
    EXPECT_FALSE(cmdMenu.isRunning());
    delete cmdMenu;
}


int main(int argc, char **argv) {
    ::testing::InitGoogleTest(&argc, argv);
    return RUN_ALL_TESTS();
}