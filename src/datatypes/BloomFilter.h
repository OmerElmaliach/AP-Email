
#include <vector>
#include "MyHash.h"


using namespace std;

template <typename T, typename Hash>

class BloomFilter {
private:
    /////// an object given when building the item, incharg IO 
    //////////FileStorage fileStorage;


    //size of array the filter is updating
    int arraySize
    // the hash function the bloom filter will use
    Hash hash;
    ////////the thing we are hashing, must be hashable
    //////////T key 

    vector<char> m_bitVector
public:    
    //////////// get rid of this - BloomFilter(const FileStorage& fs, const Hash& h);

    // constr a bloom filter with hash and size of int 
    BloomFilter(Hash hash, int arraySize);

    /////// constr a bloom filter with storge and hash and string 
   //////////  BloomFilter(Hash hash, int arraySize, std::string string); ##############dont think we need this###########


    //set a new hash for the bloom filter
    void setHash( Hash hash);

    // this is the "main" function, it gets a key and uses its hash and arraySize to convert the key
    void convertToArray(T key);

    //returns the current bit array of all filtered hashed
    vector<char> getFiltered();

};
















