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


class ThreadPool {
public:
    ThreadPool(size_t numThreads) : stop(false) {
        for (size_t i = 0; i < numThreads; ++i) {
            workers.emplace_back([this] {
                while (true) {
                    std::function<void()> task;
                    {
                        std::unique_lock<std::mutex> lock(this->queue_mutex);
                        this->condition.wait(lock, [this] { return this->stop || !this->tasks.empty(); });
                        if (this->stop && this->tasks.empty())
                            return;
                        task = std::move(this->tasks.front());
                        this->tasks.pop();
                    }
                    task();
                }
            });
        }
    }
    template<class F>
    void enqueue(F&& f) {
        {
            std::unique_lock<std::mutex> lock(queue_mutex);
            tasks.emplace(std::forward<F>(f));
        }
        condition.notify_one();
    }
    ~ThreadPool() {
        {
            std::unique_lock<std::mutex> lock(queue_mutex);
            stop = true;
        }
        condition.notify_all();
        for (std::thread &worker : workers)
            worker.join();
    }
private:
    std::vector<std::thread> workers;
    std::queue<std::function<void()>> tasks;
    std::mutex queue_mutex;
    std::condition_variable condition;
    bool stop;
};

/**
 * @brief Constructs a Server object and initializes the server socket.
 * @param port The port number to bind to.
 */
Server::Server(int port) {
    this->serverSocket = socket(AF_INET, SOCK_STREAM, 0);
    if (this->serverSocket < 0) {
        throw runtime_error("Socket creation failed");
        exit(1);
    }
    if (checkValidInput(to_string(port))) {
        this->port = port;
    } else {
        throw runtime_error("Invalid port number");
        exit(1);
    }

    memset(this->buffer, 0, BUFFER_SIZE); // Initialize buffer
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
bool Server::startServer(vector<int> args_filter) {


    
    if (m_Stor->loadInput().empty() && m_Stor->loadFilterArray().empty())
    {
        this->m_Stor->save(args_filter);
        // vector of zeros in the size of the bloom array
        vector<char> filter(args_filter[0], 0);
        this->m_Stor->save(filter);
    }
    
   

    this->running = true; // Set running flag to true
    memset(&this->serverAddr, 0, sizeof(this->serverAddr)); // Clear server address structure
    this->serverAddr.sin_family = AF_INET; // IPv4
    this->serverAddr.sin_addr.s_addr = INADDR_ANY; // Accept connections from any address
    this->serverAddr.sin_port = htons(this->port); // Convert port number to network byte order
    if (bind(this->serverSocket, (struct sockaddr*)&this->serverAddr, sizeof(this->serverAddr)) < 0) {
        throw runtime_error("Bind failed");
        return false;
    }
    
    // Add the listen call to start accepting connections
    if (listen(this->serverSocket, MAX_CLIENTS) < 0) {  // Allow up to 5 pending connections
        throw runtime_error("Listen failed");
        return false;
    }
    
    return true;
}      // Initialize socket, bind, and listen
        
/**
 * @brief Accepts a client connection and delegates handling to the App instance.
 * @param clientAddr The sockaddr_in structure for the client.
 */
void Server::acceptAndHandleClient() {
    ThreadPool pool(MAX_CLIENTS);
    while (this->running) {
        struct sockaddr_in clientAddr;
        unsigned int addrLen = sizeof(clientAddr);
        int clientSocket = accept(this->serverSocket, (struct sockaddr*)&clientAddr, &addrLen);
        if (clientSocket < 0) {
            std::this_thread::sleep_for(std::chrono::milliseconds(100));
            continue;
        }
        pool.enqueue([this, clientSocket]() {
            try {
                this->app->run(clientSocket, this->m_Stor);
            } catch (const std::exception& e) {
                // Log error here in future
            }
            close(clientSocket);
        });
    }
}

/**
 * @brief Validates if the given string is a valid port number in range 1024-65535.
 * @param argv The string to validate.
 * @return True if valid, false otherwise.
 */
bool Server::checkValidInput(const std::string& argv) {
    return std::regex_match(argv, std::regex("^[1-9][0-9]{3,4}$")) 
    && (std::stoi(argv) >= 1024 && std::stoi(argv) <= 65535);
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
        throw runtime_error("Invalid client socket");
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
;