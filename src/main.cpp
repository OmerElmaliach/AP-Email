#include <Server.h>

// Main function, runs the run function inside app object.
int main(int argc, char* argv[]) {
    vector<int> args_filter;
    if (argc < 2) {
        // incorrect number of arguments
        exit(1);
    }
    if (!Server::checkValidInput(argv[1])) {
        // invalid port number
        exit(1);
    }
    Server server(std::stoi(argv[1])); // Create a server object with the given port number
    for (int i = 2; i < argc; i++) {
        // check bloom filter settings are numbers
        int is_number = atoi(argv[i]);
        // If is_number = 0, invalid input.
        if (!is_number)
        {
            exit(1);
        }
        args_filter.push_back(is_number);
    }
    try
    {
        server.startServer(args_filter); // Start the server
    }
    catch(const std::exception& e)
    {   
        exit(1); // Handle exceptions
    }
    while (true) {  // Server never stops working
        try
        {
            server.acceptAndHandleClient(); // Accept and handle client connections
        }
        catch(const std::exception& e)
        {
            exit(1); // Handle exceptions
        }
        
    }
    try
    {
        server.stopServer(); // Stop the server
    }
    catch(const std::exception& e)
    {   
        exit(1); // Handle exceptions
    }
    
    return 0; // Exit the program
}