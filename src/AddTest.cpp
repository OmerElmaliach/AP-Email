#include <gtest/gtest.h>
#include <string>
#include <vector>

#include "AddURLCommand.h"  // The AddURLCommand header you provided
#include "datatypes/bloomFilterStorage.h"  // Your actual bloomFilterStorage header
#include "datatypes/MyHash.h"
#include "datatypes/BloomFilter.h"



// Test fixture for AddURLCommand
class AddURLCommandTest : public ::testing::Test {
protected:
    // Use the actual bloomFilterStorage and BloomFilter classes
    bloomFilterStorage storage;
    BloomFilter<std::string, MyHash> bloomFilter;
    std::string url = "http://example.com";  // URL to test
    AddURLCommand addURLCommand{storage, url, bloomFilter};

        // add parameters for  bloomfilter, addurl needs this file
      std::vector<int> data = {16, 1, 2, 3};
    
      // Call the save function with the initialized vector
      save(data);

    // Utility to check that the URL is correctly saved in storage
    void checkURLSaved() {
        EXPECT_EQ(storage.loadUrls(), url);
    }

  
};

// Test case: Test that the URL is saved correctly in storage and the bit array is updated
TEST_F(AddURLCommandTest, TestExecuteCommand) {
    // Run the command to add the URL
    addURLCommand.executeCommand();

    // Check if the URL has been saved in the storage
    checkURLSaved();

    // Check if the bit array was saved in the storage
    checkBitArraySaved();
}

// Test case: Verify that the URL already exists and does not overwrite
TEST_F(AddURLCommandTest, TestURLExists) {
    // Save an initial URL in the storage
    storage.save(url);

    // Run the command with the same URL
    addURLCommand.executeCommand();

    // Check that the URL has not been overwritten
    EXPECT_EQ(storage.loadUrls(), url);
}
