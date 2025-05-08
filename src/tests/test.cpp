#include <gtest/gtest.h>

#include <string>
#include <vector>
#include <optional>
#include <memory>
#include <Istorage.h>
#include <fileStorage.h>
#include <bloomFilterStorage.h>
#include <imenu.h>
#include <app.h>
#include <Server.h>


class ICommand {
    
};

// Should pass if an IMenu object was created.
TEST(AppTest, objectCreation) {
    App* app = new App();
    std::cout << "App created\n";
    delete app;
    std::cout << "App destroyed\n";
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
    EXPECT_TRUE(filesystem::exists("/Ap_Email/data/test.txt"));
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

// Test: remove method with specific data when multiple duplicates exist
TEST_F(fileStorageTest, Remove_DeletesSpecificData) {
    string testData1 = "Hello, world!";
    string testData2 = "Hello, world!";
    string testData3 = "Goodbye, world!";
    storage->save(testData1);
    storage->save(testData2);
    storage->save(testData3);
    
    storage->remove(testData1);
    
    auto result = storage->load();
    ASSERT_TRUE(result.has_value());
    EXPECT_EQ(testData3, result.value());
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
    EXPECT_TRUE(filesystem::exists("/Ap_Email/data/bloomFilterStorage.txt"));
    EXPECT_TRUE(filesystem::exists("/Ap_Email/data/urls.txt"));
    EXPECT_TRUE(filesystem::exists("/Ap_Email/data/input.txt"));
    EXPECT_TRUE(filesystem::exists("/Ap_Email/data/filter.txt"));
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
    string testData1 = "hello";
    string testData2 = "goodbye";
    storage->save(testData1);
    storage->save(testData2);
    string expected = "hello\ngoodbye";
    
    auto result = storage->loadUrls();
    ASSERT_TRUE(result != "");
    EXPECT_EQ(result, expected);
}

// Test: exist method for specific data when several datas saved
TEST_F(bloomFilterStorageTest, Exists_ReturnsTrueWhenSeveralDatasSaved) {
    string testData1 = "hello";
    string testData2 = "goodbye";
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
    ASSERT_TRUE(result.empty());
    EXPECT_FALSE(result == testData2);
}

// Test: remove method for all appearances of specific data when several datas saved
TEST_F(bloomFilterStorageTest, RemoveAll_DeletesAllAppearancesOfDataWhenSeveralDatasSaved) {
    vector<int> testData1 = {1, 2, 3};
    vector<int> testData2 = {1, 2, 3};
    vector<int> testData3 = {4, 5, 6};
    storage->save(testData1);
    storage->save(testData2);
    storage->save(testData3);
    
    storage->remove(testData1);
    
    auto result = storage->loadInput();
    EXPECT_EQ(result, testData3);
    EXPECT_FALSE(result == testData1);
}

class ServerTest : public testing::Test {
protected:
    std::unique_ptr<Server> server;

    void SetUp() override {
        server = std::make_unique<Server>(8080);
    }

    void TearDown() override {
        server.reset();
    }
};

// Test: Constructor initializes correctly
TEST_F(ServerTest, Constructor_InitializesCorrectly) {
    EXPECT_EQ(server->getPort(), 8080);
    EXPECT_FALSE(server->isRunning());
}

// Test: Start server
TEST_F(ServerTest, StartServer_SetsRunningFlag) {
    EXPECT_TRUE(server->startServer());
    EXPECT_TRUE(server->isRunning());
}

// Test: Stop server
TEST_F(ServerTest, StopServer_ClearsRunningFlag) {
    server->startServer();
    EXPECT_TRUE(server->stopServer());
    EXPECT_FALSE(server->isRunning());
}

// Test: Set and get port
TEST_F(ServerTest, SetAndGetPort) {
    server->setPort(9090);
    EXPECT_EQ(server->getPort(), 9090);
}

// Test: Set and get server socket
TEST_F(ServerTest, SetAndGetServerSocket) {
    server->setServerSocket(1234);
    EXPECT_EQ(server->getServerSocket(), 1234);
}

// Test: Set and get running flag
TEST_F(ServerTest, SetAndGetRunningFlag) {
    server->setRunningFlag(true);
    EXPECT_TRUE(server->isRunning());
    server->setRunningFlag(false);
    EXPECT_FALSE(server->isRunning());
}

// Test: Accept and handle a single client
TEST_F(ServerTest, AcceptAndHandleSingleClient) {
    // Simulate starting the server
    server->startServer();

    // Create a mock client address
    struct sockaddr_in mockClientAddr;
    mockClientAddr.sin_family = AF_INET;
    mockClientAddr.sin_port = htons(8081);
    inet_pton(AF_INET, "127.0.0.1", &mockClientAddr.sin_addr);

    // Simulate accepting a single client
    EXPECT_NO_THROW(server->acceptSingleClient(mockClientAddr));

    // Ensure the server is still running after handling the client
    EXPECT_TRUE(server->isRunning());
}

// Test: Accept and handle multiple clients
TEST_F(ServerTest, AcceptAndHandleMultipleClients) {
    // Simulate starting the server
    server->startServer();

    // Create a mock client address
    struct sockaddr_in mockClientAddr;
    mockClientAddr.sin_family = AF_INET;
    mockClientAddr.sin_port = htons(8081);
    inet_pton(AF_INET, "127.0.0.1", &mockClientAddr.sin_addr);

    // Simulate accepting and handling multiple clients
    for (int i = 0; i < 5; ++i) {
        EXPECT_NO_THROW(server->acceptAndHandleClient(mockClientAddr));
    }

    // Ensure the server is still running after handling clients
    EXPECT_TRUE(server->isRunning());
}

// Test: Kick a client
TEST_F(ServerTest, KickClient) {
    // Simulate starting the server
    server->startServer();

    // Simulate kicking a client (use a mock client socket value)
    int mockClientSocket = 1234;
    EXPECT_NO_THROW(server->kickClient(mockClientSocket));

    // Ensure the server is still running after kicking the client
    EXPECT_TRUE(server->isRunning());
}

int main(int argc, char **argv) {
    ::testing::InitGoogleTest(&argc, argv);
    return RUN_ALL_TESTS();
}