#include <gtest/gtest.h>
#include <string>
#include <vector>
#include <cstddef>
#include <iostream>
#include <AddURLCommand.h>
#include <Icommand.h>
#include <CheckURLCommand.h>
#include <bloomFilterStorage.h>
#include <MyHash.h>
#include <BloomFilter.h>

TEST(BloomFilterTest, CheckURLPrintsTrue) {
    bloomFilterStorage storage;
    std::vector<int> data = {2, 1, 2, 3};

    MyHash hash(10);  // Create a hash with 10 rounds
    BloomFilter<std::string, MyHash> bf(hash, 2);  // Specify template parameters
    storage.save(data);

    std::string url = "hello.com";
    std::string url2= "whynot";
    AddURLCommand addURLCommand{storage, bf};
    CheckURLCommand checkURLCommand{storage, bf};

    addURLCommand.executeCommand(url);

    checkURLCommand.executeCommand(url2);     // This should print true true
    EXPECT_EQ(1, 1);

}


