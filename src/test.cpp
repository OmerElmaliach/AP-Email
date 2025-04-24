#include <gtest/gtest.h>
#include <string>
#include <bits/stdc++.h>
#include "datatypes/cli.cpp"
#include "datatypes/icommand.h"
using namespace std;

class DummyCommand : public ICommand {
    void execute(string str) override {}
};


// Should pass if run() function was executed.
TEST(CLITest, runMethod) {
    CLI* cmdMenu = new CLI();
    EXPECT_NO_THROW(cmdMenu->run());
    delete cmdMenu;
}

// Non numeric first input line.
TEST(CLITest, checkInputFirstLineLetters) {
    CLI* cmdMenu = new CLI();
    EXPECT_FALSE(cmdMenu->checkInput("THIS_IS_A_TEST"));
    delete cmdMenu;
}

// Mixture of numbers and letters.
TEST(CLITest, checkInputFirstLineMixture) {
    CLI* cmdMenu = new CLI();
    EXPECT_FALSE(cmdMenu->checkInput("8adf2 1 2"));
    EXPECT_FALSE(cmdMenu->checkInput("8 a34 64"));
    EXPECT_FALSE(cmdMenu->checkInput("8 1 1 3 f1"));
    delete cmdMenu;
}

// Numeric first input line.
TEST(CLITest, checkInputFirstLineNumbers) {
    CLI* cmdMenu = new CLI();
    EXPECT_FALSE(cmdMenu->checkInput("8"));
    EXPECT_TRUE(cmdMenu->checkInput("8 6 3"));
    EXPECT_TRUE(cmdMenu->checkInput("1 2 3 4 5"));
    EXPECT_TRUE(cmdMenu->checkInput("45 4 246 6 4763 2 7"));
    delete cmdMenu;
}

// Format tests {Number} {URL}
TEST(CLITest, checkRegexWrongFormat) {
    CLI* cmdMenu = new CLI();
    EXPECT_TRUE(cmdMenu->checkRegex("2 www.example.com0"));
    EXPECT_TRUE(cmdMenu->checkRegex("2 www.example.com0"));
    EXPECT_TRUE(cmdMenu->checkRegex("1 https://www.example.com"));
    EXPECT_TRUE(cmdMenu->checkRegex("2 http://example.co.il"));
    EXPECT_TRUE(cmdMenu->checkRegex("1 https://example.com/path"));
    EXPECT_TRUE(cmdMenu->checkRegex("2 http://www.example.org"));
    EXPECT_TRUE(cmdMenu->checkRegex("1 example.org"));
    EXPECT_TRUE(cmdMenu->checkRegex("2 example.co.il"));
    EXPECT_TRUE(cmdMenu->checkRegex("2 https://example.co.il/test"));

    EXPECT_FALSE(cmdMenu->checkRegex("ABCD"));
    EXPECT_FALSE(cmdMenu->checkRegex("THIS_IS_A_TEST"));
    EXPECT_FALSE(cmdMenu->checkRegex("www.example.com0"));
    EXPECT_FALSE(cmdMenu->checkRegex("1 htp://example.com"));
    EXPECT_FALSE(cmdMenu->checkRegex("1 http://.com"));
    EXPECT_FALSE(cmdMenu->checkRegex("1 www..com"));
    EXPECT_FALSE(cmdMenu->checkRegex("1 example"));
    EXPECT_FALSE(cmdMenu->checkRegex("1 http://example"));
    EXPECT_FALSE(cmdMenu->checkRegex("1 http://example.c"));
    EXPECT_FALSE(cmdMenu->checkRegex("1 example.c"));
    EXPECT_FALSE(cmdMenu->checkRegex("1 http://exa_mple.com"));
    delete cmdMenu;
}

// Test for the split function for strings.
TEST(CLITest, checkSplitString) {
    CLI* cmdMenu = new CLI();
    string str = "This is a basic string";
    vector<string> res = cmdMenu->split(str, ' ');
    EXPECT_EQ("This", res[0]);
    EXPECT_EQ("is", res[1]);
    EXPECT_EQ("a", res[2]);
    EXPECT_EQ("basic", res[3]);
    EXPECT_EQ("string", res[4]);
}


// Test adding commands to the map.
TEST(CLITest, registerCommand) {
    CLI* cmdMenu = new CLI();
    ICommand* ic = new DummyCommand();
    int cmdone = 1;
    int cmdtwo = 2;
    EXPECT_NO_THROW(cmdMenu->registerCommand(cmdone, ic));
    EXPECT_NO_THROW(cmdMenu->registerCommand(cmdtwo, ic));
    EXPECT_NO_THROW(cmdMenu->registerCommand(cmdone, ic)); // Handles duplications.
    delete ic;
    delete cmdMenu;
}

// Test executing commands using the map.
TEST(CLITest, executeCommand) {
    CLI* cmdMenu = new CLI();
    ICommand* ic = new DummyCommand();
    int cmdone = 1;
    cmdMenu->registerCommand(cmdone, ic);
    string input = "Input";
    EXPECT_NO_THROW(cmdMenu->executeCommand(cmdone, input));
    delete ic;
    delete cmdMenu;
}

// Test the is running method, should be false for testing purposes.
TEST(CLITest, isRunning) {
    CLI* cmdMenu = new CLI();
    EXPECT_FALSE(cmdMenu->isRunning());
    delete cmdMenu;
}

// Test the exit function, should only change m_menuState for CLI.
TEST(CLITest, exitCMD) {
    CLI* cmdMenu = new CLI();
    EXPECT_NO_THROW(cmdMenu->exit());
    EXPECT_FALSE(cmdMenu->isRunning());
    delete cmdMenu;
}


int main(int argc, char **argv) {
    ::testing::InitGoogleTest(&argc, argv);
    return RUN_ALL_TESTS();
}