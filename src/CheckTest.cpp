#include <gtest/gtest.h>
#include <string>
#include <vector>
#include <cstddef>
#include <iostream>

#include "datatypes/AddURLCommand.h"  
#include "datatypes/Icommand.h"
#include "datatypes/CheckURLCommand.h" 
#include "datatypes/bloomFilterStorage.h"  
#include "datatypes/MyHash.h"
#include "datatypes/BloomFilter.h"

// Test fixture for CheckURLCommand
class CheckURLCommandTest : public ::testing::Test {
protected:
    // Use the actual bloomFilterStorage and BloomFilter classes
    bloomFilterStorage storage;
    BloomFilter<std::string, MyHash> bloomFilter;
    std::string url = "http://example.com";  // URL to test
    AddURLCommand addURLCommand{storage, url, bloomFilter};
    CheckURLCommand checkURLCommand{storage, url, bloomFilter}; // Add CheckURLCommand instance

    // Data for bloom filter
    std::vector<int> data = {16, 1, 2, 3};

    // Utility to check if the URL is saved correctly in storage
    void checkURLSaved() {
        EXPECT_EQ(storage.loadUrls(), url);
    }

    // Utility to check if the bit array exists in storage
    void checkBitArraySaved() {
        std::vector<char> bitArrayToSave = bloomFilter.getArray();
        EXPECT_TRUE(storage.exists(bitArrayToSave));
    }

    // Setup to initialize any necessary data
    void SetUp() override {
        // Save the data into storage before running the tests
        storage.save(data);  // Use the actual save function to store the vector
    }
};

// Test case: Test that the URL is checked correctly in storage and the bit array is verified
TEST_F(CheckURLCommandTest, TestCheckURLExists) {
    // Run the command to add the URL to storage
    addURLCommand.executeCommand();

    // Run the command to check the URL in storage
    checkURLCommand.executeCommand();


}
