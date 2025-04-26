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

// Test fixture for bloomFilterStorage tests
class fileStorageTest : public ::testing::Test {
protected:
    fileStorage<string> URLStorage;
    fileStorage<char*> filterStorage;
    fileStorage<vector<int>> inputStorage;
    string testFileName = "testFile.txt";
    string testFilePath = "../data/" + testFileName;

    void SetUp() override {
        // Create test files
        URLStorage = fileStorage<string>("URL" + testFileName);
        filterStorage = fileStorage<char*>("filter" + testFileName);
        inputStorage = fileStorage<vector<int>>("input" + testFileName);
    }

    void TearDown() override {
        delete URLStorage;
        delete filterStorage;
        delete inputStorage;
    }
     fileStorage<string> getURLStorage() {
        return URLStorage;
    }
    fileStorage<char*> getFilterStorage() {
        return filterStorage;
    }
    fileStorage<vector<int>> getInputStorage() {
        return inputStorage;
    }
};

// Test: save method
TEST_F(fileStorageTest tester, Save_ReturnsTrueOnSuccess) {
    string testData = "Hello, world!";
    tester.getURLStorage().save(testData);
    auto result = tester.getURLStorage().load();
    EXPECT_EQ(result, testData);
}

// Test: load method with no data
TEST_F(fileStorageTest tester, Load_ReturnsNoValueWhenNoData) {
    auto result = tester.getURLStorage().load();
    EXPECT_FALSE(result.has_value());
}

// Test: load method with data
TEST_F(fileStorageTest tester, Load_ReturnsDataWhenDataExists) {
    string testData = "Hello, world!";
    tester.getURLStorage(testData);
    
    auto result = tester.getURLStorage().load();
    ASSERT_TRUE(result.has_value());
    EXPECT_EQ(testData, result.value());
}

// Test: exists method with no data
TEST_F(fileStorageTest tester, Exists_ReturnsFalseWhenNoData) {
    // Remove any existing data first
    tester.getURLStorage().remove();
    bool result = tester.getURLStorage().exists();
    EXPECT_FALSE(result);
}

// Test: exists method with data
TEST_F(fileStorageTest tester, Exists_ReturnsTrueWhenDataExists) {
    string testData = "Hello, world!";
    tester.getURLS().save(testData);
    
    bool result = tester.getURLS().exists();
    EXPECT_TRUE(result);
}

// Test: overwrite data
TEST_F(fileStorageTest tester, Save_OverwritesExistingData) {
    string testData1 = "Hello, world!";
    string testData2 = "Goodbye, world!";
    
    tester.getURLS().save(testData1);
    tester.getURLS().save(testData2);
    
    auto result = tester.getURLS().load();
    ASSERT_TRUE(result.has_value());
    EXPECT_EQ(testData2, result.value());
}

// Test with integers
TEST_F(fileStorageTest tester, CanStoreAndRetrieveIntegers) {
    vector<int> testData = {42, 43, 44};
    tester.getInputStorage().save(testData);
    
    auto result = tester.getInputStorage().load();
    ASSERT_TRUE(result.has_value());
    EXPECT_EQ(testData, result.value());
}

// Test: remove method
TEST_F(fileStorageTest tester, Remove_DeletesData) {
    string testData = "Hello, world!";
    tester.getURLS().save(testData);
    
    tester.getURLS().remove();
    
    auto result = tester.getURLS().load();
    EXPECT_FALSE(result.has_value());
}

// Test: remove method when no data exists
TEST_F(fileStorageTest tester, Remove_NoDataDoesNotThrow) {
    EXPECT_NO_THROW(tester.getURLS().remove());
}

// Test: remove specific data
TEST_F(fileStorageTest tester, Remove_SpecificData) {
    string testData1 = "Hello, world!";
    tester.getURLS().save(testData1);
    
    tester.getURLS().remove(testData1);
    
    auto result = tester.getURLS().load();
    EXPECT_FALSE(result.has_value());
}

int main(int argc, char **argv) {
    ::testing::InitGoogleTest(&argc, argv);
    return RUN_ALL_TESTS();
}