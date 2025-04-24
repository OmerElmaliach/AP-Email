#include <gtest/gtest.h>
#include "datatypes/MyHash.h"  // Make sure to include your MyHash header file

// Test the constructor and default behavior (number of rounds).
TEST(MyHashTest, ConstructorWorks) {
    MyHash<std::string> hasher(3);
    std::string key = "hello";
    std::size_t h1 = hasher(key);

    // Ensure hash produces consistent results
    EXPECT_EQ(h1, hasher(key)); 
}

TEST(MyHashTest, SetRoundsChangesHashingBehavior) {
    MyHash<std::string> hasher(1);  // Start with 1 round
    std::string key = "hello";
    std::size_t h1 = hasher(key);

    // Change rounds to 3
    hasher.setRounds(3);
    std::size_t h2 = hasher(key);

    // The hash should change when rounds are increased
    EXPECT_NE(h1, h2);
}

TEST(MyHashTest, HashConsistencyWithSameRounds) {
    MyHash<std::string> hasher(2);  // 2 rounds of hashing
    std::string key = "hello.com";

    // Hash should be consistent for the same input
    std::size_t h1 = hasher(key);
    std::size_t h2 = hasher(key);

    EXPECT_EQ(h1, h2);  // Same input, same hash
}

TEST(MyHashTest, DifferentInputsProduceDifferentHashes) {
    MyHash<std::string> hasher(2);  // 2 rounds of hashing
    std::string key1 = "hello.com";
    std::string key2 = "hello22.com";

    // Hashes for different keys should differ (in most cases)
    EXPECT_NE(hasher(key1), hasher(key2));
}

TEST(MyHashTest, MultipleRoundsImpactHash) {
    MyHash<std::string> hasher1(1);  // 1 round of hashing
    MyHash<std::string> hasher2(5);  // 5 rounds of hashing
    std::string key = "www.hello.com";

    std::size_t h1 = hasher1(key);
    std::size_t h2 = hasher2(key);

    // More rounds will likely produce a different hash result
    EXPECT_NE(h1, h2);
}

TEST(MyHashTest, SetRoundsResetsHashingBehavior) {
    MyHash<std::string> hasher(3);  // 3 rounds of hashing
    std::string key = "hello";

    // Get initial hash value
    std::size_t h1 = hasher(key);

    // Change rounds to 1
    hasher.setRounds(1);
    std::size_t h2 = hasher(key);

    // With 1 round, the hash should be different from 3 rounds
    EXPECT_NE(h1, h2);
}

// Test for comparing MyHash after setRounds() with a new MyHash initialized with the same rounds
TEST(MyHashTest, SetRoundsEqualsNewHashWithSameRounds) {
    MyHash<std::string> hasher1(3);  // Initialize with 3 rounds
    MyHash<std::string> hasher2(1);  // Initialize with 1 round
    std::string key = "hello";

    // Hash the key with hasher1 and hasher2
    std::size_t h1 = hasher1(key);
    std::size_t h2 = hasher2(key);

    // Change hasher2 rounds to match hasher1 (3 rounds)
    hasher2.setRounds(3);

    // Now, both hashes should be identical
    std::size_t h3 = hasher2(key);

    EXPECT_EQ(h1, h3);  // Both should produce the same hash with 3 rounds
    EXPECT_NE(h1, h2);  // Originally, they were different because they had different rounds
}

// Test for comparing MyHash to manually performing std::hash multiple times
TEST(MyHashTest, CompareToManualStdHash) {
    MyHash<std::string> hasher(3);  // 3 rounds of hashing
    std::string key = "hello";
    
    // Perform manual std::hashing multiple times
    std::hash<std::string> baseHash;
    std::size_t manualHash = baseHash(key);
    for (int i = 1; i < 3; ++i) {
        manualHash = std::hash<std::size_t>{}(manualHash);  // rehash manually
    }

    // Get the hash from MyHash
    std::size_t myHash = hasher(key);

    // Verify that MyHash produces the same result as manual hashing
    EXPECT_EQ(manualHash, myHash);  // The results should match
}
