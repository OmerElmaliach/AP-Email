#include <gtest/gtest.h>
#include <string>
#include <vector>
#include <optional>
#include <memory>
#include "datatypes/Istorage.h"
#include "datatypes/fileStorage.h"

// Should pass if test.cpp was compiled using the docker script.
TEST(DockerTest, CompileFile) {
    EXPECT_STREQ("DOCKERTEST", "DOCKERTEST");
}

using namespace std;
using namespace testing;

// Concrete implementation for testing


// Define test types
class fileStorageTest : public testing::Test {
    protected:
        unique_ptr<fileStorage> storage;
    
        void SetUp() override {
            storage = make_unique<fileStorage>("test.txt");
        }
    
        void TearDown() override {
            storage->remove(); // clean up if necessary
        }
    };
    
// Test: constructor
TEST_F(fileStorageTest, Constructor_CreatesFile) {
    EXPECT_TRUE(filesystem::exists("../data/test.txt"));
}

// Test: save method
    
TEST_F(fileStorageTest, Save_ReturnsTrueOnSuccess) {
    string testData = "Hello, world!";
    storage->save(testData);
    auto result = storage->load();
    ASSERT_TRUE(result.has_value());
    EXPECT_EQ(result.value(), testData);
}

// Test: load method with no data

TEST_F(fileStorageTest, Load_returnsEmptyWhenNoData) {
    storage->remove();
    auto result = storage->load();
    EXPECT_FALSE(result.has_value());
}

// Test: load method with specific data
TEST_F(fileStorageTest, Load_ReturnsDataWhenDataExists) {
    string testData = "Hello, world!";
    storage->save(testData);
    auto result = storage->load(testData);
    ASSERT_TRUE(result.has_value());
    EXPECT_EQ(testData, result.value());
}

// Test: exists method with no data
TEST_F(fileStorageTest, Exists_ReturnsFalseWhenNoData) {
    bool result = storage->exists();
    EXPECT_TRUE(result);
}

// Test: exists method with specific data
TEST_F(fileStorageTest, Exists_ReturnsTrueWhenDataExists) {
    string testData = "Hello, world!";
    storage->save(testData);
    bool result = storage->exists(testData);
    EXPECT_TRUE(result);
}

// look at this and see if implementation really overwrites instead of appending

// Test: overwrite data
TEST_F(fileStorageTest, Save_OverwritesExistingData) {
    string testData1 = "Hello, world!";
    string testData2 = "Goodbye, world!";
    storage->save(testData1);
    storage->save(testData2);
    
    auto result = storage->load();
    ASSERT_TRUE(result.has_value());
    EXPECT_EQ(testData2, result.value());
}

// // Test with integers
// TEST(fileStorageTest, CanStoreAndRetrieveIntegers) {
//     int testData = 42;
//     storage->save(testData);
    
//     auto result = storage->load();
//     ASSERT_TRUE(result.has_value());
//     EXPECT_EQ(testData, result.value());
// }

// Test: remove method
TEST_F(fileStorageTest, Remove_DeletesData) {
    string testData = "Hello, world!";
    storage->save(testData);
    
    storage->remove(testData);
    
    auto result = storage->load();
    EXPECT_FALSE(result.has_value());
}

// Test: remove method when no data exists
TEST_F(fileStorageTest, Remove_NoDataDoesNotThrow) {
    EXPECT_NO_THROW(storage->remove());
}


int main(int argc, char **argv) {
    ::testing::InitGoogleTest(&argc, argv);
    return RUN_ALL_TESTS();
}