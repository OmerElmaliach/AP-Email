#include <Server.h>

// Main function, runs the run function inside app object.
int main(int argc, char* argv[]) {
    if (argc < 2) {
        for (size_t i = 0; i < argc; i++)
        {
            printf("%s\n", argv[i]); // Print all arguments passed to the program
        }
        
        return 1;
    }
    if (!Server::checkValidInput(argv[1])) {
        return 1;
    }
    Server server(std::stoi(argv[1])); // Create a server object with the given port number
    server.startServer(); // Start the server
    while (true) {  // Server never stops working
        printf("Waiting for client connection...\n");
        server.acceptAndHandleClient(); // Accept and handle client connections
        printf("Client disconnected.\n");
    }
    server.stopServer(); // Stop the server
    return 0; // Exit the program
}