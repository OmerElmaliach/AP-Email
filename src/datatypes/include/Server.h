#ifndef SERVER_H
#define SERVER_H

#include <app.h>
#include <iostream>
#include <thread>
#include <mutex>
#include <atomic>
#include <vector>
#include <queue>
#include <condition_variable>
#include <string>
#include <cstring>

#ifdef _WIN32
    #error "This file is not supported on Windows. Please use a Linux environment."
#else
    #include <sys/types.h>
    #include <sys/socket.h>
    #include <netinet/in.h>
    #include <arpa/inet.h>
    #include <unistd.h>
    #include <netdb.h>
#endif

class Server {
    private:
        int port;
        int serverSocket;
        bool running;
        struct sockaddr_in serverAddr, clientAddr;
        App* app;                // Your existing command handling logic
    
    public:
        Server(int port);
        bool checkValidInput(const std::string& input); // Check if the input is valid
        bool startServer();      // Initialize socket, bind, and listen
        bool stopServer();       // Close socket and cleanup
        bool isRunning() const;  // Check server status
                
        void kickClient(int clientSocket); // Handle client in a separate thread
        void acceptAndHandleClient(sockaddr_in clientAddr); // Accept and handle a client

        int getPort() const; // Get the server port
        void setPort(int newPort); // Set the server port
        int getServerSocket() const; // Get the server socket
        void setServerSocket(int newServerSocket); // Set the server socket

        bool getIsRunningFlag() const; // Get the running flag
        void setRunningFlag(bool isRunning); // Set the running flag

        
    };

#endif // SERVER_H