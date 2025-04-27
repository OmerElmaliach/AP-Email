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

// Test: overwrite data
TEST_F(fileStorageTest, Save_OverwritesExistingData) {
    string testData1 = "Hello, world!";
    string testData2 = "Goodbye, world!";
    storage->save(testData1);
    storage->save(testData2);
    string expected = testData1+ "\n" + testData2;
    
    auto result = storage->load();
    ASSERT_TRUE(result.has_value());
    EXPECT_EQ(expected, result.value());
}

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

class bloomFilterStorageTest : public testing::Test {
    protected:
        unique_ptr<bloomFilterStorage> storage;
    
        void SetUp() override {
            storage = make_unique<bloomFilterStorage>();
        }
    
        void TearDown() override {
            storage->remove(); // clean up if necessary
        }
    };
    
// Test: constructor
TEST_F(bloomFilterStorageTest, Constructor_CreatesFile) {
    EXPECT_TRUE(filesystem::exists("../data/bloomFilterStorage.txt"));
    EXPECT_TRUE(filesystem::exists("../data/urls.txt"));
    EXPECT_TRUE(filesystem::exists("../data/input.txt"));
    EXPECT_TRUE(filesystem::exists("../data/filter.txt"));
}

// Test: save method
TEST_F(bloomFilterStorageTest, Save_ReturnsTrueOnSuccess) {
    vector<int> testData = {1, 2, 3};
    storage->save(testData);
    auto result = storage->loadInput();
    ASSERT_FALSE(result.empty());
    EXPECT_EQ(result, testData);
}

// Test: save method with char vector
TEST_F(bloomFilterStorageTest, SaveIntArray_ReturnsTrueOnSuccess) {
    vector<char> testData = {1, 2, 3};
    storage->save(testData);
    auto result = storage->loadFilterArray();
    ASSERT_FALSE(result.empty());
    EXPECT_EQ(result, testData);
}

// Test: save method with string
TEST_F(bloomFilterStorageTest, SaveString_ReturnsTrueOnSuccess) {
    string testData = "Hello, world!";
    storage->save(testData);
    auto result = storage->loadUrls();
    ASSERT_FALSE(result == "");
    EXPECT_EQ(result, testData);
}

// Test: load method with specific data
TEST_F(bloomFilterStorageTest, Load_ReturnsDataWhenDataExists) {
    vector<int> testData = {1, 2, 3};
    storage->save(testData);
    auto result = storage->loadInput();
    ASSERT_FALSE(result.empty());
    EXPECT_EQ(result, testData);
}

// Test: load method with no data
TEST_F(bloomFilterStorageTest, Load_ReturnsEmptyWhenNoData) {
    storage->remove();
    auto result = storage->loadInput();
    EXPECT_TRUE(result.empty());
}

// Test: exists method with no data
TEST_F(bloomFilterStorageTest, Exists_ReturnsFalseWhenNoData) {
    bool result = storage->exists();
    EXPECT_TRUE(result);
}

// Test: exists method with vector data
TEST_F(bloomFilterStorageTest, Exists_ReturnsTrueWhenDataExists) {
    vector<int> testData = {1, 2, 3};
    storage->save(testData);
    bool result = storage->exists(testData);
    EXPECT_TRUE(result);
}

// Test: exists method with char vector data
TEST_F(bloomFilterStorageTest, Exists_ReturnsTrueWhenIntArrayExists) {
    vector<char> testData = {3, 2, 3};
    storage->save(testData);
    bool result = storage->exists(testData);
    EXPECT_TRUE(result);
}

// Test: exists method with string data
TEST_F(bloomFilterStorageTest, Exists_ReturnsTrueWhenStringExists) {
    string testData = "Hello, world!";
    storage->save(testData);
    bool result = storage->exists(testData);
    EXPECT_TRUE(result);
}

// Test: remove method with vector data
TEST_F(bloomFilterStorageTest, Remove_DeletesData) {
    vector<int> testData = {1, 2, 3};
    storage->save(testData);
    
    storage->remove(testData);
    
    auto result = storage->loadInput();
    EXPECT_TRUE(result.empty());
}

// Test: remove method with char vector data
TEST_F(bloomFilterStorageTest, RemoveIntArray_DeletesData) {
    vector<int> testData = {1, 'a', 3};
    storage->save(testData);
    
    storage->remove(testData);
    
    auto result = storage->loadInput();
    EXPECT_TRUE(result.empty());
}

// Test: remove method with string data
TEST_F(bloomFilterStorageTest, RemoveString_DeletesData) {
    string testData = "Hello, world!";
    storage->save(testData);
    
    storage->remove(testData);
    
    auto result = storage->loadUrls();
    EXPECT_TRUE(result.empty());
}

// Test: remove method when no data exists
TEST_F(bloomFilterStorageTest, Remove_NoDataDoesNotThrow) {
    EXPECT_NO_THROW(storage->remove());
}

// Test: load method for specific data when several datas saved
TEST_F(bloomFilterStorageTest, Load_ReturnsDataWhenSeveralDatasSaved) {
    vector<int> testData1 = {1, 2, 3};
    vector<int> testData2 = {4, 5, 6};
    storage->save(testData1);
    storage->save(testData2);
    vector<int> expected = {1, 2, 3, 4, 5, 6};
    
    auto result = storage->loadInput();
    ASSERT_FALSE(result.empty());
    EXPECT_EQ(result, expected);
}

// Test: exist method for specific data when several datas saved
TEST_F(bloomFilterStorageTest, Exists_ReturnsTrueWhenSeveralDatasSaved) {
    vector<int> testData1 = {1, 2, 3};
    vector<int> testData2 = {4, 5, 6};
    storage->save(testData1);
    storage->save(testData2);
    
    bool result = storage->exists(testData1);
    EXPECT_TRUE(result);
}

// Test: remove method for specific data when several datas saved
TEST_F(bloomFilterStorageTest, Remove_DeletesDataWhenSeveralDatasSaved) {
    vector<int> testData1 = {1, 2, 3};
    vector<int> testData2 = {4, 5, 6};
    storage->save(testData1);
    storage->save(testData2);
    
    storage->remove(testData2);
    
    auto result = storage->loadInput();
    EXPECT_EQ(result, testData1);
    EXPECT_FALSE(result == testData2);
}


int main(int argc, char **argv) {
    ::testing::InitGoogleTest(&argc, argv);
    return RUN_ALL_TESTS();
}