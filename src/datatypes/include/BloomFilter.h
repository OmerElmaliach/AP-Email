#ifndef BLOOMFILTER_H
#define BLOOMFILTER_H


#include <cstddef>
#include <algorithm>
#include <vector>
#include <MyHash.h>



template <typename T, typename Hash>
class BloomFilter {
private:
    //size of array the filter is updating- it how many bits we need and the mod value for hashed result
    std::size_t m_vectorSize;
    // the hash function the bloom filter will use
    Hash m_hash;
    //to implement the actuall bit array we use char vector for its dynamics
    std::vector<char> m_charVector;
public:    

    // constr a bloom filter with hash and size of int 
    BloomFilter(Hash hash, std::size_t vectorSize = 16);

    //set a new hash for the bloom filter
    void setHash( Hash hash);

    // this is the "main" function, it gets a key and uses its hash and arraySize to convert the key
    void filter(T key);

    //returns the current bit array of all filtered hashed
    std::vector<char> getFiltered();
    
    //set all chars in vector to zero 
    void resetBitArray(); 
    // set the size of the array
    void setArraySize(int size);

};

    // constr a bloom filter with hash and size of int and
    template <typename T, typename Hash>
    BloomFilter<T, Hash>::BloomFilter(Hash hash, std::size_t vectorSize):
    m_vectorSize(vectorSize),           // Initialize m_vectorSize
    m_hash(hash),                      // Initialize m_hash
    m_charVector(vectorSize, 0)         // Initialize bitArray with size and false values
    {}
    
   

  //set a new hash for the bloom filter
  template <typename T, typename Hash>
  void BloomFilter<T, Hash>::setHash(Hash hash){
    m_hash = hash;
    }



    // this is the "main" function, it gets a key and uses its hash and arraySize to convert the key
    template <typename T, typename Hash>
    void BloomFilter<T, Hash>::filter(T key){

        //hash the key with filters hash member
        std::size_t hashed = m_hash(key);
        //devide by vectorSize the hashed value to find its coresponding bit
        std::size_t bitToMark = hashed % m_vectorSize;
        //give the "bit" a val 1
        m_charVector[bitToMark] = 1;


    }


    //returns the current bit array of all filtered hashed
    template <typename T, typename Hash>
    std::vector<char> BloomFilter<T, Hash>::getFiltered(){
        return m_charVector;
    }

    //set all chars to zero for next time
    template <typename T, typename Hash>
    void BloomFilter<T, Hash>::resetBitArray(){
        std::fill(m_charVector.begin(), m_charVector.end(), 0);
    } 

    // set the size of the array
    template <typename T, typename Hash>
    void  BloomFilter<T, Hash>::setArraySize(int newSize){
        m_vectorSize = newSize;
        m_charVector.resize(m_vectorSize, 0);

    }



    #endif // BLOOMFILTER_H














