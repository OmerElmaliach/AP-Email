#include <Server.h>

// Main function, runs the run function inside app object.
int main(int argc, char* argv[]) {
    if (argc < 2) {
        return 1;
    }
    if (!Server::checkValidInput(argv[1])) {
        return 1;
    }
    Server server((int) argv[1]); // Create a server object with the given port number
    server.startServer(); // Start the server
    server.acceptAndHandleClient(); // Accept and handle client connections
    server.stopServer(); // Stop the server
    return 0; // Exit the program
}