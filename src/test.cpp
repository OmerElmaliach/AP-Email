#include <gtest/gtest.h>
#include <string>
#include <vector>
#include <optional>
#include <memory>
#include <Istorage.h>
#include <fileStorage.h>

// Should pass if test.cpp was compiled using the docker script.
TEST(DockerTest, CompileFile) {
    EXPECT_STREQ("DOCKERTEST", "DOCKERTEST");
}

using namespace std;

// Concrete implementation for testing

template <typename T>
class MemoryStorage : public IStorage<T> {
private:
    optional<T> data_;

public:
    bool save(const T& data) override {
        data_ = data;
        return true;
    }

    optional<T> load() override {
        return data_;
    }

    bool exists() const override {
        return data_.has_value();
    }
};

// Test fixture
template <typename T>
class StorageTest : public ::testing::Test {
protected:
    unique_ptr<IStorage<T>> storage_;

    void SetUp() override {
        storage_ = make_unique<MemoryStorage<T>>();
    }
};

// Define test types
typedef StorageTest<string> StringStorageTest;
typedef StorageTest<int> IntStorageTest;

// Test: save method
TEST_F(StringStorageTest, Save_ReturnsTrueOnSuccess) {
    string testData = "Hello, world!";
    bool result = storage_->save(testData);
    EXPECT_TRUE(result);
}

// Test: load method with no data
TEST_F(StringStorageTest, Load_ReturnsNulloptWhenNoData) {
    auto result = storage_->load();
    EXPECT_FALSE(result.has_value());
}

// Test: load method with data
TEST_F(StringStorageTest, Load_ReturnsDataWhenDataExists) {
    string testData = "Hello, world!";
    storage_->save(testData);
    
    auto result = storage_->load();
    ASSERT_TRUE(result.has_value());
    EXPECT_EQ(testData, result.value());
}

// Test: exists method with no data
TEST_F(StringStorageTest, Exists_ReturnsFalseWhenNoData) {
    bool result = storage_->exists();
    EXPECT_FALSE(result);
}

// Test: exists method with data
TEST_F(StringStorageTest, Exists_ReturnsTrueWhenDataExists) {
    string testData = "Hello, world!";
    storage_->save(testData);
    
    bool result = storage_->exists();
    EXPECT_TRUE(result);
}

// Test: overwrite data
TEST_F(StringStorageTest, Save_OverwritesExistingData) {
    string testData1 = "Hello, world!";
    string testData2 = "Goodbye, world!";
    
    storage_->save(testData1);
    storage_->save(testData2);
    
    auto result = storage_->load();
    ASSERT_TRUE(result.has_value());
    EXPECT_EQ(testData2, result.value());
}

// Test with integers
TEST_F(IntStorageTest, CanStoreAndRetrieveIntegers) {
    int testData = 42;
    storage_->save(testData);
    
    auto result = storage_->load();
    ASSERT_TRUE(result.has_value());
    EXPECT_EQ(testData, result.value());
}

// Test: remove method
TEST_F(StringStorageTest, Remove_DeletesData) {
    string testData = "Hello, world!";
    storage_->save(testData);
    
    storage_->remove();
    
    auto result = storage_->load();
    EXPECT_FALSE(result.has_value());
}
// Test: remove method when no data exists
TEST_F(StringStorageTest, Remove_NoDataDoesNotThrow) {
    EXPECT_NO_THROW(storage_->remove());
}


int main(int argc, char **argv) {
    ::testing::InitGoogleTest(&argc, argv);
    return RUN_ALL_TESTS();
}