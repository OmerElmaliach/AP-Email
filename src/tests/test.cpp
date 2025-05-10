#include <gtest/gtest.h>
#include <cli.h>
#include <Icommand.h>
#include <string>
#include <bloomFilterStorage.h>
using namespace std;

class TestCommand : public Icommand {
    std::string executeCommand(const std::string& URL) {
        return "Works!";
    }
};

bloomFilterStorage m_Stor;
CLI* cmdMenu = new CLI(1, m_Stor);

// Format tests {String} {URL}
TEST(CLITest, checkRegexWrongFormat) {
    EXPECT_TRUE(cmdMenu->checkRegex("GET www.example.com0"));
    EXPECT_FALSE(cmdMenu->checkRegex("ABCD"));
    EXPECT_TRUE(cmdMenu->checkRegex("GET www.example.com0"));
    EXPECT_TRUE(cmdMenu->checkRegex("POST https://www.example.com"));
    EXPECT_TRUE(cmdMenu->checkRegex("GET http://example.co.il"));
    EXPECT_TRUE(cmdMenu->checkRegex("POST https://example.com/path"));
    EXPECT_TRUE(cmdMenu->checkRegex("GET http://www.example.org"));
    EXPECT_TRUE(cmdMenu->checkRegex("POST example.org"));
    EXPECT_TRUE(cmdMenu->checkRegex("GET example.co.il"));
    EXPECT_TRUE(cmdMenu->checkRegex("GET https://example.co.il/test"));
    EXPECT_FALSE(cmdMenu->checkRegex("GET             wfdsww.goofdsgle..cofdfm     "));
    EXPECT_FALSE(cmdMenu->checkRegex("GET   TEST    www.google.com     "));

    EXPECT_FALSE(cmdMenu->checkRegex("THIS_IS_A_TEST"));
    EXPECT_FALSE(cmdMenu->checkRegex("www.example.com0"));
    EXPECT_FALSE(cmdMenu->checkRegex("POST htp://example.com"));
    EXPECT_FALSE(cmdMenu->checkRegex("POST http://.com"));
    EXPECT_FALSE(cmdMenu->checkRegex("POST www..com"));
    EXPECT_FALSE(cmdMenu->checkRegex("POST example"));
    EXPECT_FALSE(cmdMenu->checkRegex("POST http://example"));
    EXPECT_FALSE(cmdMenu->checkRegex("POST http://example.c"));
    EXPECT_FALSE(cmdMenu->checkRegex("POST example.c"));
    EXPECT_FALSE(cmdMenu->checkRegex("POST http://exa_mple.com"));
}


// Test adding commands to the map.
TEST(CLITest, registerCommand) {
    Icommand* ic = new TestCommand();
    string new1 = "NEW1";
    string new2 = "NEW2";
    EXPECT_NO_THROW(cmdMenu->registerCommand(new1, ic));
    EXPECT_NO_THROW(cmdMenu->registerCommand(new2, ic));
    EXPECT_NO_THROW(cmdMenu->registerCommand(new1, ic)); // Handles duplications.
    delete ic;
}

// Test executing commands using the map.
TEST(CLITest, executeCommand) {
    Icommand* ic = new TestCommand();
    string test = "Test";
    string test2 = "";
    cmdMenu->registerCommand(test, ic);
    EXPECT_EQ(cmdMenu->m_cmdMap[test]->executeCommand(test2), "Works!");
    delete ic;
}

// Test the is running method, should be true if exit was not called.
TEST(CLITest, isRunning) {
    EXPECT_FALSE(cmdMenu->isRunning());
}

// Test the exit function, should only change m_menuState for CLI.
TEST(CLITest, exitCMD) {
    EXPECT_NO_THROW(cmdMenu->exit());
    EXPECT_FALSE(cmdMenu->isRunning());
}


int main(int argc, char **argv) {
    ::testing::InitGoogleTest(&argc, argv);
    return RUN_ALL_TESTS();
}