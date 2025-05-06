#ifndef APP_H
#define APP_H

class App {
public:
    /**
     * @brief Initializes an imenu type object and runs it.
     */
    void run();

    
    /**
     * @brief Initializes an imenu type object and runs it, supports socket.
     * 
     * @param sock Active socker.
     */
    void run(int sock);
};

#endif