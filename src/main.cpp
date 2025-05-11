#include <Server.h>

// Main function, runs the run function inside app object.
int main(int argc, char* argv[]) {
    vector<int> args_filter;
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
    for (int i = 2; i < argc; i++) {
        int is_number = atoi(argv[i]);
        // If is_number = 0, invalid input.
        if (!is_number)
            exit(1);
        
        args_filter.push_back(is_number);
    }
    server.startServer(args_filter); // Start the server
    while (true) {  // Server never stops working
        server.acceptAndHandleClient(); // Accept and handle client connections
    }
    server.stopServer(); // Stop the server
    return 0; // Exit the program
}