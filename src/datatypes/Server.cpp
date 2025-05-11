/**
 * @file Server.cpp
 * @brief Implements the Server class for managing TCP connections and delegating client handling to the App class.
 */

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
#include <sys/types.h>
#include <sys/socket.h>
#include <netinet/in.h>
#include <arpa/inet.h>
#include <unistd.h>
#include <netdb.h>
#include <Server.h>
#include <cstdlib> // for rand() and srand()
#include <regex>

#define MAX_CLIENTS 5 ///< Maximum number of pending connections
#define BUFFER_SIZE 4096
#define SERVER_PORT 8080 + rand() % 30000 ///< Random port value
using namespace std;

/**
 * @brief Constructs a Server object and initializes the server socket.
 * @param port The port number to bind to.
 */
Server::Server(int port) {
    this->serverSocket = socket(AF_INET, SOCK_STREAM, 0);
    if (this->serverSocket < 0) {
        perror("Socket creation failed");
        exit(1);
    }
    if (checkValidInput(to_string(port))) {
        this->port = port;
    } else {
        perror("Invalid port number");
        exit(1);
    }

    this->buffer[BUFFER_SIZE] = {0}; // Initialize buffer
    this->running = false;
    this->app = new App(); 
    this->m_Stor = new bloomFilterStorage(); // Initialize storage object
    this->serverAddr = {0}; // Initialize server address structure
    this->clientAddr = {0}; // Initialize client address structure

}

/**
 * @brief Initializes the server socket, binds, and starts listening for connections.
 * @return True on success, false on failure.
 */
bool Server::startServer() {
    this->running = true; // Set running flag to true
    memset(&this->serverAddr, 0, sizeof(this->serverAddr)); // Clear server address structure
    this->serverAddr.sin_family = AF_INET; // IPv4
    this->serverAddr.sin_addr.s_addr = INADDR_ANY; // Accept connections from any address
    this->serverAddr.sin_port = htons(this->port); // Convert port number to network byte order
    if (bind(this->serverSocket, (struct sockaddr*)&this->serverAddr, sizeof(this->serverAddr)) < 0) {
        perror("Bind failed");
        return false;
    }
    
    // Add the listen call to start accepting connections
    if (listen(this->serverSocket, MAX_CLIENTS) < 0) {  // Allow up to 5 pending connections
        perror("Listen failed");
        return false;
    }
    
    return true;
}      // Initialize socket, bind, and listen
        
/**
 * @brief Accepts a client connection and delegates handling to the App instance.
 * @param clientAddr The sockaddr_in structure for the client.
 */
void Server::acceptAndHandleClient() {
    struct sockaddr_in clientAddr; // Client address structure
    printf("1\n");
    unsigned int addrLen = sizeof(clientAddr);
    printf("2\n");
    int clientSocket = accept(this->serverSocket, (struct sockaddr*) &clientAddr, &addrLen);
    printf("3\n");
    if (clientSocket < 0) {
        perror("Accept failed");
        printf("4\n");
        return;
    }
    printf("5\n");
    // Delegate handling to the app instance
    this->app->run(clientSocket, this->m_Stor); // Pass the server socket and client socket to the app instance
    printf("6\n");
    close(clientSocket); // Close the client socket after handling
    printf("7\n");
}

/**
 * @brief Validates if the given string is a valid port number.
 * @param argv The string to validate.
 * @return True if valid, false otherwise.
 */
bool Server::checkValidInput(const std::string& argv) {
    regex port_reg("^([0-9]|[1-9][0-9]{1,3}|[1-5][0-9]{4}|6[0-4][0-9]{3}|65[0-4][0-9]{2}|655[0-2][0-9]|6553[0-5])$");
    return regex_match(argv, port_reg);
}


/**
 * @brief Checks if the server is currently running.
 * @return True if running, false otherwise.
 */
bool Server::isRunning() const {
    return this->running; // Check server status
}  // Check server status


/**
 * @brief Forcibly disconnects a client by closing its socket.
 * @param clientSocket The client socket file descriptor.
 */
void Server::kickClient(int clientSocket) {
    if (clientSocket >= 0) {
        close(clientSocket); // Close the client socket
    } 
    else {
        perror("Invalid client socket");
    }

} 

/**
 * @brief Gets the server's port number.
 * @return The port number.
 */
int Server::getPort() const {
    return this->port; // Get the server port
} // Get the server port

/**
 * @brief Sets the server's port number.
 * @param newPort The new port number.
 */
void Server::setPort(int newPort) {
    this->port = newPort; // Set the server port
}

/**
 * @brief Gets the server socket file descriptor.
 * @return The server socket file descriptor.
 */
int Server::getServerSocket() const {
    return this->serverSocket; // Get the server socket
}

/**
 * @brief Sets the server socket file descriptor.
 * @param newServerSocket The new server socket file descriptor.
 */
void Server::setServerSocket(int newServerSocket) {
    this->serverSocket = newServerSocket; // Set the server socket
}

/**
 * @brief Sets the running flag.
 * @param isRunning The new running state.
 */
void Server::setRunningFlag(bool isRunning) {
    this->running = isRunning; // Set the running flag
} 

/**
 * @brief Gets the server address structure.
 * @return The server address structure.
 */
struct sockaddr_in Server::getServerAddr() const {
    return this->serverAddr; // Get the server address
} // Get the server address
/**
 * @brief Sets the server address structure.
 * @param newServerAddr The new server address structure.
 */
void Server::setServerAddr(const struct sockaddr_in& newServerAddr) {
    this->serverAddr = newServerAddr; // Set the server address
}
/**
 * @brief Gets the client address structure.
 * @return The client address structure.
 */
struct sockaddr_in Server::getClientAddr() const {
    return this->clientAddr; // Get the client address

} // Get the client address

/**
 * @brief Sets the client address structure.
 * @param newClientAddr The new client address structure.
 */
void Server::setClientAddr(const struct sockaddr_in& newClientAddr) {
    this->clientAddr = newClientAddr; // Set the client address
} 

/**
 * @brief Stops the server and releases resources.
 * @return True on success, false on failure.
 */
bool Server::stopServer() {
    this->running = false;
    if (close(this->serverSocket) < 0) {
        perror("Socket close failed");
        return false;
    }
    this->serverSocket = -1; // Reset the server socket
    return true;
}       // Close socket and cleanup


/**
 * @brief Destructor for the Server class.
 */
Server::~Server() {
    delete this->app; // Clean up the App instance
    delete this->m_Stor; // Clean up the storage object
    if (this->serverSocket >= 0) {
        close(this->serverSocket); // Close the server socket
    }
    this->serverSocket = -1; // Reset the server socket
    this->running = false; // Reset the running flag
} // Destructor