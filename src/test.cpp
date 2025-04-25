#include <gtest/gtest.h>
#include <string>
#include <vector>
#include <optional>
#include <memory>
#include <Istorage.h>
#include <fileStorage.h>
#include <bloomFilterStorage.h>

// Should pass if test.cpp was compiled using the docker script.
TEST(DockerTest, CompileFile) {
    EXPECT_STREQ("DOCKERTEST", "DOCKERTEST");
}

using namespace std;

// Concrete implementation for testing


// Define test types
bloomFilterStorage storage = new bloomFilterStorage();

// Test: save method
TEST_F(storage, Save_ReturnsTrueOnSuccess) {
    string testData = "Hello, world!";
    storage.save(testData);
    result = storage.getUrls().load();
    EXPECT_EQ(result, testData);
}

// Test: load method with no data
TEST_F(storage, Load_ReturnsDataWhenDataExists) {
    auto result = storage.load();
    EXPECT_EQ(result, storage&);
}

// Test: load method with data
TEST_F(storage, Load_ReturnsDataWhenDataExists) {
    string testData = "Hello, world!";
    storage.save(testData);
    
    auto result = storage.load();
    ASSERT_TRUE(result.has_value());
    EXPECT_EQ(testData, result.value());
}

// Test: exists method with no data
TEST_F(storage, Exists_ReturnsFalseWhenNoData) {
    bool result = storage.exists();
    EXPECT_FALSE(result);
}

// Test: exists method with data
TEST_F(storage, Exists_ReturnsTrueWhenDataExists) {
    string testData = "Hello, world!";
    storage.save(testData);
    
    bool result = storage.exists();
    EXPECT_TRUE(result);
}

// look at this and see if implementation really overwrites instead of appending

// Test: overwrite data
TEST_F(storage, Save_OverwritesExistingData) {
    string testData1 = "Hello, world!";
    string testData2 = "Goodbye, world!";
    
    storage.save(testData1);
    storage.save(testData2);
    
    auto result = storage.load();
    ASSERT_TRUE(result.has_value());
    EXPECT_EQ(testData2, result.value());
}

// Test with integers
TEST_F(storage, CanStoreAndRetrieveIntegers) {
    int testData = 42;
    storage.save(testData);
    
    auto result = storage.load();
    ASSERT_TRUE(result.has_value());
    EXPECT_EQ(testData, result.value());
}

// Test: remove method
TEST_F(storage, Remove_DeletesData) {
    string testData = "Hello, world!";
    storage.save(testData);
    
    storage.remove(testData);
    
    auto result = storage.loadUrls();
    EXPECT_FALSE(result.has_value());
}
// Test: remove method when no data exists
TEST_F(storage, Remove_NoDataDoesNotThrow) {
    EXPECT_NO_THROW(storage.remove());
}


int main(int argc, char **argv) {
    ::testing::InitGoogleTest(&argc, argv);
    return RUN_ALL_TESTS();
}