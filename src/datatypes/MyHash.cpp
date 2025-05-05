#include <functional>
#include <cstddef>
#include <MyHash.h>


    
    MyHash::MyHash(int r) : m_rounds(r) {}

    
    void MyHash:: setRounds (int rounds){
        m_rounds = rounds;
    }


   /* Operation overload(?), this will allow the hash function to hash '(key)' 
    *  and be used as a hash function
    */ 
   std::size_t MyHash:: operator()(const std::string& key) const {
    std::hash<std::string> baseHash;
    std::size_t hashed = baseHash(key);
    
    // Start from one so it's one less iteration because already hashed once
    for (int i = 1; i < m_rounds; ++i) {
        
        //conver to string so it can be hashed again (number is hashed to itself)
        std::string hashedStr = std::to_string(hashed);
        // Hash the string
        hashed = std::hash<std::string>{}(hashedStr);

    }

    return hashed;
}

