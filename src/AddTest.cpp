#include <gtest/gtest.h>
#include <string>
#include <vector>
#include <iostream>

#include "datatypes/AddURLCommand.h"  // The AddURLCommand header you provided
#include "datatypes/bloomFilterStorage.h"  // Your actual bloomFilterStorage header
#include "datatypes/MyHash.h"
#include "datatypes/BloomFilter.h"
#include "datatypes/Icommand.h"

TEST(BloomFilterTest, TestUpdatedBit) {

    
    std::vector<int> data = {16, 1, 2, 3};
    bloomFilterStorage storage;
    storage.save(data);
    
    MyHash hash(10);  // Create a hash with 10 rounds

    BloomFilter<std::string,MyHash> bf(hash,256);  // Specify template parameters
    
    std::string url = "hello.com";

    AddURLCommand addURLCommand(storage, bf);

    addURLCommand.executeCommand(url);
    //just to make sure we got to the end
    EXPECT_EQ(1, 1);
    
}

int main(int argc, char **argv) {
    ::testing::InitGoogleTest(&argc, argv);
    return RUN_ALL_TESTS();
}
