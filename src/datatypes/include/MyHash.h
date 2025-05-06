
#ifndef MYHASH_H
#define MYHASH_H

#include <string>



class MyHash {

private:
    // number of times to hash
    int m_rounds;

public:
    //costructor 
    MyHash(int rounds);
    //setter to change the number of rounds hash will go
    void setRounds (int rounds);
    //oppration overload, this will allow the hash function to hash'(key)' and be used as a hash function
    std::size_t operator()(const std::string& key) const;


};


#endif // MYHASH_H
