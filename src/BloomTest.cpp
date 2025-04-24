#include <gtest/gtest.h>
#include "datatypes/BloomFilter.h"
#include "datatypes/MyHash.h"  


// Test: Compare BloomFilter outputs with 10 rounds of hashing
TEST(BloomFilterTest, TestUpdatedBit) {
    // Create a hash with 10 rounds
    MyHash<std::string> hash(10); 

    // Initialize a BloomFilter with the hash and array size of 256
    BloomFilter<std::string, MyHash<std::string>> bf(hash, 256);

    // Add the same key to the BloomFilter
    std::string key = "hello.com";
    bf.filter(key);

    // Get the filtered bit vector from the BloomFilter
    auto filtered = bf.getArray();

    // Test that the bit vector has the correct size (256)
    EXPECT_EQ(filtered.size(), 256);

    // Check that at least one bit is set (this depends on the hash, so it may be anywhere in the vector)
    bool anyBitSet = false;
    for (char bit : filtered) {
        if (bit == 1) {
            anyBitSet = true;
            break;
        }
    }

    // Assert that some bit was set (this is expected when applying a non-trivial hash function)
    EXPECT_TRUE(anyBitSet);
}



// Test: Compare BloomFilter with 10 rounds and a larger array size
TEST(BloomFilterTest, TestUpdatedBit2) {
    // Create a hash with 10 rounds
    MyHash<std::string> hash(10);

    // init a BloomFilter 
    BloomFilter<std::string, MyHash<std::string>> bf(hash, 512);

    // add the key to the BloomFilter
    std::string key = "sample";
    bf.filter(key);

    // Get the filtered bit vector from the BloomFilter
    auto filtered = bf.getArray();

    // test correct size (512)
    EXPECT_EQ(filtered.size(), 512);

    // Check that at least one bit is set
    bool anyBitSet = false;
    for (char bit : filtered) {
        if (bit == 1) {
            anyBitSet = true;
            break;
        }
    }

    // test that some bit was set
    EXPECT_TRUE(anyBitSet);
}


// different hashes but same key result should be EQ
TEST(BloomFilterTest, SameKeyProducesSameVector) {
    std::string key = "hello.com";
    BloomFilter<std::string, MyHash<std::string>> bf(MyHash<std::string>(1), 256);
    
    // Run with 20 different hash configs
    for (int rounds = 1; rounds <= 20; ++rounds) {
        bf.setHash(MyHash<std::string>(rounds));
        bf.filter(key);
    }

    // Save the resulting vector
    std::vector<char> result = bf.getArray();

    // Repeat the same process in a new BloomFilter
    BloomFilter<std::string, MyHash<std::string>> bf2(MyHash<std::string>(1), 256);
    for (int rounds = 1; rounds <= 20; ++rounds) {
        bf2.setHash(MyHash<std::string>(rounds));
        bf2.filter(key);
    }

    // Compare vectors
    EXPECT_EQ(result, bf2.getArray());
}

// Same hashes but different key result should be NE
TEST(BloomFilterTest, DifferentKeyProducesDifferentVector) {
    std::string key1 = "hello.com";
    std::string key2 = "hello22.com";

    BloomFilter<std::string, MyHash<std::string>> bf1(MyHash<std::string>(1), 256);
    BloomFilter<std::string, MyHash<std::string>> bf2(MyHash<std::string>(1), 256);

    for (int rounds = 1; rounds <= 20; ++rounds) {
        bf1.setHash(MyHash<std::string>(rounds));
        bf1.filter(key1);

        bf2.setHash(MyHash<std::string>(rounds));
        bf2.filter(key2);
    }

    EXPECT_NE(bf1.getArray(), bf2.getArray());
}

// round 2 different hashes but same key result should be EQ
TEST(BloomFilterTest, SameKeyProducesSameVector2) {
    std::string key = "aufbeuf54646364gwnegig.co.il";
    std::size_t arraySize = 256;

    std::vector<int> rounds = {13, 4, 18, 8, 40};

    BloomFilter<std::string, MyHash<std::string>> bf1(MyHash<std::string>(1), arraySize);
    BloomFilter<std::string, MyHash<std::string>> bf2(MyHash<std::string>(1), arraySize);

    for (int r : rounds) {
        MyHash<std::string> hash(r);

        bf1.setHash(hash);
        bf1.filter(key);

        bf2.setHash(hash);
        bf2.filter(key);
    }

    EXPECT_EQ(bf1.getArray(), bf2.getArray());
}

// round 2:  Same hashes but different key result should be NE 
TEST(BloomFilterTest, DifferentKeyProducesDifferentVector2) {
    std::string key1 = "cat";
    std::string key2 = "dog";
    std::size_t arraySize = 256;

    std::vector<int> rounds = {13, 4, 18, 8, 40};

    BloomFilter<std::string, MyHash<std::string>> bf1(MyHash<std::string>(1), arraySize);
    BloomFilter<std::string, MyHash<std::string>> bf2(MyHash<std::string>(1), arraySize);

    for (int r : rounds) {
        MyHash<std::string> hash(r);

        bf1.setHash(hash);
        bf1.filter(key1);

        bf2.setHash(hash);
        bf2.filter(key2);
    }

    EXPECT_NE(bf1.getArray(), bf2.getArray());
}





