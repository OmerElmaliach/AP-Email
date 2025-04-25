#include <gtest/gtest.h>
#include <string>
#include <vector>
#include <optional>
#include <memory>
#include "datatypes/Istorage.h"
#include "datatypes/fileStorage.h"
#include "datatypes/bloomFilterStorage.h"

// Should pass if test.cpp was compiled using the docker script.
TEST(DockerTest, CompileFile) {
    EXPECT_STREQ("DOCKERTEST", "DOCKERTEST");
}

using namespace std;

// Test fixture for bloomFilterStorage tests
class BloomFilterStorageTest : public ::testing::Test {
protected:
    bloomFilterStorage* storage;

    void SetUp() override {
        storage = new bloomFilterStorage();
    }

    void TearDown() override {
        delete storage;
    }
};

// Test: save method
TEST_F(BloomFilterStorageTest, Save_ReturnsTrueOnSuccess) {
    string testData = "Hello, world!";
    EXPECT_TRUE(storage->save(testData));
    
    auto result = storage->loadUrls();
    ASSERT_TRUE(result.has_value());
    EXPECT_EQ(result.value(), testData);
}

// Test: load method with no data
TEST_F(BloomFilterStorageTest, Load_ReturnsNoValueWhenNoData) {
    auto result = storage->loadUrls();
    EXPECT_FALSE(result.has_value());
}

// Test: load method with data
TEST_F(BloomFilterStorageTest, Load_ReturnsDataWhenDataExists) {
    string testData = "Hello, world!";
    storage->save(testData);
    
    auto result = storage->loadUrls();
    ASSERT_TRUE(result.has_value());
    EXPECT_EQ(testData, result.value());
}

// Test: exists method with no data
TEST_F(BloomFilterStorageTest, Exists_ReturnsFalseWhenNoData) {
    // Remove any existing data first
    storage->remove();
    bool result = storage->exists();
    EXPECT_FALSE(result);
}

// Test: exists method with data
TEST_F(BloomFilterStorageTest, Exists_ReturnsTrueWhenDataExists) {
    string testData = "Hello, world!";
    storage->save(testData);
    
    bool result = storage->exists();
    EXPECT_TRUE(result);
}

// Test: overwrite data
TEST_F(BloomFilterStorageTest, Save_OverwritesExistingData) {
    string testData1 = "Hello, world!";
    string testData2 = "Goodbye, world!";
    
    storage->save(testData1);
    storage->save(testData2);
    
    auto result = storage->loadUrls();
    ASSERT_TRUE(result.has_value());
    EXPECT_EQ(testData2, result.value());
}

// Test with integers
TEST_F(BloomFilterStorageTest, CanStoreAndRetrieveIntegers) {
    vector<int> testData = {42, 43, 44};
    storage->save(testData);
    
    auto result = storage->loadInput();
    ASSERT_TRUE(result.has_value());
    EXPECT_EQ(testData, result.value());
}

// Test: remove method
TEST_F(BloomFilterStorageTest, Remove_DeletesData) {
    string testData = "Hello, world!";
    storage->save(testData);
    
    storage->remove();
    
    auto result = storage->loadUrls();
    EXPECT_FALSE(result.has_value());
}

// Test: remove method when no data exists
TEST_F(BloomFilterStorageTest, Remove_NoDataDoesNotThrow) {
    EXPECT_NO_THROW(storage->remove());
}

// Test: remove specific data
TEST_F(BloomFilterStorageTest, Remove_SpecificData) {
    string testData1 = "Hello, world!";
    storage->save(testData1);
    
    storage->remove(testData1);
    
    auto result = storage->loadUrls();
    EXPECT_FALSE(result.has_value());
}

int main(int argc, char **argv) {
    ::testing::InitGoogleTest(&argc, argv);
    return RUN_ALL_TESTS();
}