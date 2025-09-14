#include <gtest/gtest.h>
#include <AddURLCommand.h>
#include <DeleteURLCommand.h>
#include <CheckURLCommand.h>
#include <bloomFilterStorage.h>
#include <MyHash.h>
#include <BloomFilter.h>

TEST(CommandTests, AddAndCheckURL) {

    bloomFilterStorage storage;
    MyHash hash(10);
    BloomFilter<std::string, MyHash> bf(hash, 2);  // Specify template parameters

    std::vector<int> data = {2, 1, 2, 3};
    storage.save(data);
    
    AddURLCommand addCmd(storage, bf);
    CheckURLCommand checkCmd(storage, bf);

    // Add a new URL
    std::string result = addCmd.executeCommand("www.k.com");
    EXPECT_EQ(result, "201 Created");

    // Re-adding the same URL
    result = addCmd.executeCommand("www.k.com");
    EXPECT_EQ(result, "201 Created");

    // Check URL existence
    result = checkCmd.executeCommand("www.k.com");
    EXPECT_EQ(result, "200 Ok\n\ntrue true");
}


//make sure storge is working
TEST(BloomFilterStorageTests, ConstructorCreatesFiles) {
    bloomFilterStorage storage;
    EXPECT_TRUE(storage.getInput().exists());
    EXPECT_TRUE(storage.getUrls().exists());
    EXPECT_TRUE(storage.getFilter().exists());
}

TEST(BloomFilterStorageTests, SaveAndLoadInputVector) {
    bloomFilterStorage storage;
    std::vector<char> inputVec = {1, 0, 1,0,1,0,1,0};
    storage.save(inputVec);

    vector<char> loaded = storage.loadFilterArray();
    EXPECT_EQ(loaded, inputVec);
}

//gota make sure math still works! for without math, we have nothing.
TEST(logicFunctionality, logicFunctionality) {

    EXPECT_EQ(1 + 1, 2);
    EXPECT_TRUE(3 < 5);
}

TEST(CommandTests, DeleteURLBehavior) {
    bloomFilterStorage storage;
    MyHash hash(10);
    BloomFilter<std::string, MyHash> bf(hash, 2);

    AddURLCommand addCmd(storage, bf);
    DeleteURLCommand delCmd(storage, bf);
    CheckURLCommand checkCmd(storage, bf);

    // Add and delete a URL
    addCmd.executeCommand("www.p.com");
    std::string result = delCmd.executeCommand("www.p.com");
    EXPECT_EQ(result, "204 No Content");

    // Delete again — should be 404
    result = delCmd.executeCommand("www.p.com");
    EXPECT_EQ(result, "404 Not Found");

    // Check after deletion
    result = checkCmd.executeCommand("www.p.com");
    EXPECT_EQ(result, "200 Ok\n\ntrue false");
}

TEST(CommandTests, BadURLFormatIgnoredInLogic) {
    bloomFilterStorage storage;
    MyHash hash(10);
    BloomFilter<std::string, MyHash> bf(hash, 2);

    AddURLCommand addCmd(storage, bf);
    std::string result = addCmd.executeCommand("not_a_valid_url");

    // Still accepted, because format check is CLI responsibility
    EXPECT_EQ(result, "201 Created");
}
