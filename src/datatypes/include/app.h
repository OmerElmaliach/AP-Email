#ifndef APP_H
#define APP_H
#include <bloomFilterStorage.h>

class App {
public:
    /**
     * @brief Initializes an imenu type object and runs it, supports socket.
     * 
     * @param sock Active socket.
     * @param p_bloomFilterStorage Pointer to a bloom filter storage.
     */
    void run(int sock, bloomFilterStorage& p_bloomFilterStorage);
};

#endif