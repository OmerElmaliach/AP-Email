/**
 * @file Server.h
 * @brief Defines the Server class for managing client connections and delegating messaging to the App layer.
 */
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
#include <bloomFilterStorage.h>

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

/**
 * @class Server
 * @brief Handles TCP server socket setup, client connection management, and delegates client messaging to the App class.
 */
class Server {
private:
    int port;                         ///< Port number the server listens on.
    int serverSocket;                 ///< File descriptor for the server socket.
    bool running;                     ///< Indicates if the server is running.
    struct sockaddr_in serverAddr, clientAddr; ///< Server and client address structures.
    bloomFilterStorage* m_Stor;       ///< Storage for Bloom filter data (not owned by Server).
    App* app;                         ///< Pointer to the application logic handler.

public:
    /**
     * @brief Constructs a Server object on the given port.
     * @param port Port number to bind the server socket to.
     */
    Server(int port);

    /**
     * @brief Checks if the input string is a valid port number.
     * @param input String to validate.
     * @return True if valid, false otherwise.
     */
    bool checkValidInput(const std::string& input);

    /**
     * @brief Initializes the server socket, binds, and starts listening.
     * @return True on success, false on failure.
     */
    bool startServer();

    /**
     * @brief Stops the server and releases resources.
     * @return True on success, false on failure.
     */
    bool stopServer();

    /**
     * @brief Checks if the server is currently running.
     * @return True if running, false otherwise.
     */
    bool isRunning() const;

    /**
     * @brief Forcibly disconnects a client by closing its socket.
     * @param clientSocket The client socket file descriptor.
     */
    void kickClient(int clientSocket);

    /**
     * @brief Accepts a client connection and delegates handling to the App instance.
     * @param clientAddr The sockaddr_in structure for the client.
     */
    void acceptAndHandleClient(sockaddr_in clientAddr);

    /**
     * @brief Gets the server's port number.
     * @return The port number.
     */
    int getPort() const;

    /**
     * @brief Sets the server's port number.
     * @param newPort The new port number.
     */
    void setPort(int newPort);

    /**
     * @brief Gets the server socket file descriptor.
     * @return The server socket file descriptor.
     */
    int getServerSocket() const;

    /**
     * @brief Sets the server socket file descriptor.
     * @param newServerSocket The new server socket file descriptor.
     */
    void setServerSocket(int newServerSocket);

    /**
     * @brief Gets the running flag.
     * @return True if running, false otherwise.
     */
    bool getIsRunningFlag() const;

    /**
     * @brief Sets the running flag.
     * @param isRunning The new running state.
     */
    void setRunningFlag(bool isRunning);

    /**
     * @brief Gets the server address structure.
     * @return The server address structure.
     */
    struct sockaddr_in getServerAddr() const;

    /**
     * @brief Sets the server address structure.
     * @param addr The new server address structure.
     */
    void setServerAddr(const struct sockaddr_in& addr);

    /**
     * @brief Gets the client address structure.
     * @return The client address structure.
     */
    struct sockaddr_in getClientAddr() const;

    /**
     * @brief Sets the client address structure.
     * @param addr The new client address structure.
     */
    void setClientAddr(const struct sockaddr_in& addr);
    ~Server(); ///< Destructor to clean up resources.
}
;

#endif // SERVER_H