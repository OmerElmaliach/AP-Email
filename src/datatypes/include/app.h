#ifndef APP_H
#define APP_H
#include <BloomFilter.h>
#include <string>
#include <MyHash.h>

class App {
public:
    /**
     * @brief Initializes an imenu type object and runs it.
     */
    void run();

    
    /**
     * @brief Initializes an imenu type object and runs it, supports socket.
     * 
     * @param sock Active socket.
     */
    void run(int sock, BloomFilter<string, MyHash> bloomFilter);
};

#endif