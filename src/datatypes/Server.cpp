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

#define BUFFER_SIZE 4096
#define SERVER_PORT 8080 + rand() % 30000 // Random port value
using namespace std;

bool Server::checkValidInput(const std::string& argv) {
    regex port_reg("^([0-9]|[1-9][0-9]{1,3}|[1-5][0-9]{4}|6[0-4][0-9]{3}|65[0-4][0-9]{2}|655[0-2][0-9]|6553[0-5])$");
    return regex_match(argv, port_reg);
}

Server::Server(int port) {
    this->port = port;
    if ((this->serverSocket = socket(AF_INET, SOCK_STREAM, 0)) == 0) {
        perror("Socket creation failed");
        exit(1);
    }

    // Set SO_REUSEADDR to allow reuse of the address and port
    int opt = 1;
    if (setsockopt(this->serverSocket, SOL_SOCKET, SO_REUSEADDR, &opt, sizeof(opt)) < 0) {
        perror("setsockopt failed");
        exit(1);
    }

    this->running = false;
    this->app = new App(); 
}

bool Server::startServer() {
    this->running = true; // Set running flag to true
    this->serverAddr.sin_family = AF_INET; // IPv4
    this->serverAddr.sin_addr.s_addr = INADDR_ANY; // Accept connections from any address
    this->serverAddr.sin_port = htons(this->port); // Port number
    if (bind(this->serverSocket, (struct sockaddr*)&this->serverAddr, sizeof(this->serverAddr)) < 0) {
        perror("Bind failed");
        return false;
    }
    return true; // Placeholder for actual implementation
}      // Initialize socket, bind, and listen

bool Server::stopServer() {
    this->running = false;
    if (close(this->serverSocket) < 0) {
        perror("Socket close failed");
        return false;
    }
    this->serverSocket = -1; // Reset the server socket
    return true;
}       // Close socket and cleanup
bool Server::isRunning() const {
    return this->running; // Check server status
}  // Check server status
        
void Server::acceptAndHandleClient(sockaddr_in clientAddr) {
    int clientSocket = accept(this->serverSocket, (struct sockaddr*)&clientAddr, (socklen_t*)&clientAddr);
    if (clientSocket < 0) {
        perror("Accept failed");
        return;
    }

    // Delegate handling to the app instance
    this->app->run();

    close(clientSocket); // Close the client socket after handling
} // Accept a client and handle commands until client disconnects or server stops

void Server::kickClient(int clientSocket) {
    if (clientSocket >= 0) {
        close(clientSocket); // Close the client socket
    } 
    // else {
    //     cout << "Invalid client socket" << endl;
    // }

} // Handle client in a separate thread

int Server::getPort() const {
    return this->port; // Get the server port
} // Get the server port
void Server::setPort(int newPort) {
    this->port = newPort; // Set the server port
} // Set the server port
int Server::getServerSocket() const {
    return this->serverSocket; // Get the server socket
} // Get the server socket
void Server::setServerSocket(int newServerSocket) {
    this->serverSocket = newServerSocket; // Set the server socket
} // Set the server socket

void Server::setRunningFlag(bool isRunning) {
    this->running = isRunning; // Set the running flag
} // Set the running flag

// int main() {
//     Server server(SERVER_PORT);
//     if (!server.checkValidInput(to_string(SERVER_PORT))()) {
//         cout << "Invalid port number" << endl;
//         perror("Invalid port number");
//     }
//     if (server.startServer()) {
//         cout << "Server started on port " << server.getPort() << endl;
//     } else {
//         cout << "Failed to start server" << endl;
//         return 1;
//     }
    
//     // Accept and handle clients in a loop
//     while (server.isRunning()) {
//         sockaddr_in clientAddr;
//         server.acceptAndHandleClient(clientAddr);
//     }
    
//     server.stopServer();
//     cout << "Server stopped" << endl;
//     return 0;
// } // Main function to run the server