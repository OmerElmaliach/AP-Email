
#include <vector>
#include "MyHash.h"

using namespace std;

template <typename T, typename Hash>

class BloomFilter {
private:
    //size of array the filter is updating- it how many bits we need and the mod value for hashed result
    std::size_t m_vectorSize;
    // the hash function the bloom filter will use
    Hash m_hash;

    vector<char> m_charVector;

public:    
    // constr a bloom filter with hash and size of int and
    BloomFilter(Hash hash, std::size_t vectorSize):
    m_arraySize(vectorSize),           // Initialize m_vectorSize
    m_hash(hash),                      // Initialize m_hash
    m_charVector(vectorSize, 0)         // Initialize bitArray with size and false values
    {}


    //set a new hash for the bloom filter
    void setHash(Hash hash){
        m_hash = hash;
    }


    // this is the "main" function, it gets a key and uses its hash and arraySize to convert the key
    void filter(T key){

        //hash the key with filters hash member
        std::size_t hashed = m_hash(key);
        //devide by vectorSize the hashed value to find its coresponding bit
        std::size_t bitToMark = hashed % m_vectorSize;
        //give the "bit" a val 1
        m_charVector[bitToMark] = 1;


    }
    
    //returns the current bit array of all filtered hashed
    vector<char> getArray(){
        return m_bitVector;
    }

};




















