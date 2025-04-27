#include <gtest/gtest.h>
#include "datatypes/MyHash.h"
#include "datatypes/BloomFilter.h"
#include <string>

// Test: Compare BloomFilter outputs with 10 rounds of hashing
TEST(BloomFilterTest, TestUpdatedBit) {
    MyHash hash(10);  // Create a hash with 10 rounds
    BloomFilter<std::string, MyHash> bf(hash, 256);  // Specify template parameters

    std::string key = "hello.com";
    bf.filter(key);

    auto filtered = bf.getFiltered();

    EXPECT_EQ(filtered.size(), 256);

    bool anyBitSet = false;
    for (char bit : filtered) {
        if (bit == 1) {
            anyBitSet = true;
            break;
        }
    }

    EXPECT_TRUE(anyBitSet);
}

// Test: Compare BloomFilter with 10 rounds and a larger array size
TEST(BloomFilterTest, TestUpdatedBit2) {
    MyHash hash(10);  // Create a hash with 10 rounds
    BloomFilter<std::string, MyHash> bf(hash, 512);  // Specify template parameters

    std::string key = "sample";
    bf.filter(key);

    auto filtered = bf.getFiltered();

    EXPECT_EQ(filtered.size(), 512);

    bool anyBitSet = false;
    for (char bit : filtered) {
        if (bit == 1) {
            anyBitSet = true;
            break;
        }
    }

    EXPECT_TRUE(anyBitSet);
}

// Different hashes but same key result should be EQ
TEST(BloomFilterTest, SameKeyProducesSameVector) {
    std::string key = "hello.com";
    BloomFilter<std::string, MyHash> bf(MyHash(1), 256);

    for (int rounds = 1; rounds <= 20; ++rounds) {
        bf.setHash(MyHash(rounds));
        bf.filter(key);
    }

    std::vector<char> result = bf.getFiltered();

    BloomFilter<std::string, MyHash> bf2(MyHash(1), 256);
    for (int rounds = 1; rounds <= 20; ++rounds) {
        bf2.setHash(MyHash(rounds));
        bf2.filter(key);
    }

    EXPECT_EQ(result, bf2.getFiltered());
}

// Same hashes but different key result should be NE
TEST(BloomFilterTest, DifferentKeyProducesDifferentVector) {
    std::string key1 = "hello.com";
    std::string key2 = "hello22.com";

    BloomFilter<std::string, MyHash> bf1(MyHash(1), 256);
    BloomFilter<std::string, MyHash> bf2(MyHash(1), 256);

    for (int rounds = 1; rounds <= 20; ++rounds) {
        bf1.setHash(MyHash(rounds));
        bf1.filter(key1);

        bf2.setHash(MyHash(rounds));
        bf2.filter(key2);
    }

    EXPECT_NE(bf1.getFiltered(), bf2.getFiltered());
}

// Same key produces same vector, different hashes in round 2
TEST(BloomFilterTest, SameKeyProducesSameVector2) {
    std::string key = "aufbeuf54646364gwnegig.co.il";
    std::size_t arraySize = 256;
    std::vector<int> rounds = {13, 4, 18, 8, 40};

    BloomFilter<std::string, MyHash> bf1(MyHash(1), arraySize);
    BloomFilter<std::string, MyHash> bf2(MyHash(1), arraySize);

    for (int r : rounds) {
        MyHash hash(r);
        bf1.setHash(hash);
        bf1.filter(key);

        bf2.setHash(hash);
        bf2.filter(key);
    }

    EXPECT_EQ(bf1.getFiltered(), bf2.getFiltered());
}

// Different key produces different vector in round 2
TEST(BloomFilterTest, DifferentKeyProducesDifferentVector2) {
    std::string key1 = "cat";
    std::string key2 = "dog";
    std::size_t arraySize = 256;

    std::vector<int> rounds = {13, 4, 18, 8, 40};

    BloomFilter<std::string, MyHash> bf1(MyHash(1), arraySize);
    BloomFilter<std::string, MyHash> bf2(MyHash(1), arraySize);

    for (int r : rounds) {
        MyHash hash(r);
        bf1.setHash(hash);
        bf1.filter(key1);

        bf2.setHash(hash);
        bf2.filter(key2);
    }

    EXPECT_NE(bf1.getFiltered(), bf2.getFiltered());
}

// Test: Resetting the BloomFilter array sets all bits to 0
TEST(BloomFilterTest, TestResetBitArray) {
    std::string key = "hello.com";
    BloomFilter<std::string, MyHash> bf(MyHash(1), 256);

    for (int rounds = 1; rounds <= 20; ++rounds) {
        bf.setHash(MyHash(rounds));
        bf.filter(key);
    }


    // Make sure some bits are set
    bool anyBitSetBefore = false;
    for (char bit : bf.getFiltered()) {
        if (bit == 1) {
            anyBitSetBefore = true;
            break;
        }
    }
    EXPECT_TRUE(anyBitSetBefore);

    // Now reset
    bf.resetBitArray();

    // After reset, all bits must be 0
    for (char bit : bf.getFiltered()) {
        EXPECT_EQ(bit, 0);
    }
}
