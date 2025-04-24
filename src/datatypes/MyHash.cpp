#include <functional>
#include <cstddef>

template <typename T>
struct MyHash {

    int m_rounds;  // how many times to hash
    
public:
    MyHash(int r) : m_rounds(r) {}

    
    void setRounds (int rounds){
        m_rounds = rounds;
    }


    std::size_t operator()(const T& key) const {
        std::hash<T> baseHash;
        std::size_t hashed = baseHash(key);

        //start from one so its one less itiration becouse already hashed once
        for (int i = 1; i < m_rounds; ++i) {
            hashed = std::hash<std::size_t>{}(hashed);  // rehash the result
        }

        return hashed;
    }
};
