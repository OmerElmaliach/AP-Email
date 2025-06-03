# AP-Email
link to repo - 
https://github.com/OmerElmaliach/AP-Email

link to jira -
https://omerelmaliachprivate.atlassian.net/jira/software/projects/AE/summary

the flow process of our work and SCRUM meeting summaries can all be found under the user story "Manage project process"

## Overview

This project implements a RESTful EMAIL server, with a C++ blacklisting server which uses bloom filter logic. The server allows user management, mail creation/retrieval, labeling, and real-time URL validation against the blacklist server.

## Architecture

The system follows the structure outlined in the provided UML diagrams:

![uml-diagram](https://github.com/user-attachments/assets/14cd9162-7d54-4aee-94e0-6461772b8234)

**C++ Blacklist Server Components:**
* **main()**: Entry point that initializes the server with port and Bloom filter parameters
* **Server**: TCP server that manages client connections, handles socket communication, and delegates processing to the App layer
* **App**: Application coordinator that creates and manages the CLI interface for each client connection
* **CLI**: Command-line interface that processes incoming commands (POST/GET/DELETE) and manages command registration
* **BloomFilter**: Core probabilistic data structure using multiple hash functions for efficient URL membership testing
* **MyHash**: Hash function provider supporting multiple hash algorithms for the Bloom filter
* **bloomFilterStorage**: Specialized storage manager handling persistence of Bloom filter data, URLs, and configuration
* **fileStorage**: File-based storage implementation providing save/load operations for persistent data
* **IStorage**: Storage interface defining standard operations (save, load, exists, remove)
* **ICommand Interface & Commands**: Command pattern implementation with AddURLCommand, CheckURLCommand, and DeleteURLCommand for modular operation handling

**JavaScript Email Server Components:**
* **JSApp**: Express.js application server running on port 9000, handling HTTP requests and routing
* **Routes Layer**: RESTful API endpoints for mails, blacklist, users, labels, and authentication tokens
* **Controllers Layer**: Business logic handlers that process HTTP requests and coordinate between routes and models
* **Models Layer**: Data access layer managing email operations, user management, and blacklist communication
* **BlacklistModel**: Specialized component that communicates with the C++ server via TCP sockets for URL validation

## How it Works

### System Initialization
1. **Blacklist Server Startup**: The C++ server initializes on a specified port (default 8091) with Bloom filter parameters (size, hash functions, seeds)
2. **Data Persistence Loading**: Server loads previously saved Bloom filter state, URL storage, and configuration from persistent storage
3. **Email Server Startup**: JavaScript Express server starts on port 9000, establishing RESTful API endpoints
4. **Docker Network**: Both services connect through a Docker bridge network enabling inter-container communication

### Email Creation & Validation Process
1. **Email Composition**: User submits email via POST /api/mails endpoint with recipients, subject, body, and optional labels
2. **URL Extraction**: System uses regex patterns to extract all URLs from email subject and body content
3. **Real-time Blacklist Validation**: For each extracted URL:
   - JavaScript BlacklistModel establishes TCP connection to C++ server (port 8091)
   - Sends GET command with URL to blacklist server
   - C++ server processes command through CLI → Command pattern → BloomFilter query
   - Returns validation result via TCP response
4. **Email Blocking/Approval**: If any URL is blacklisted, email creation fails with error; otherwise, email is processed and sent

### Blacklist Management
1. **Adding URLs**: POST /api/blacklist endpoint → TCP POST command → Bloom filter insertion + storage persistence
2. **Checking URLs**: GET /api/blacklist/:url endpoint → TCP GET command → Bloom filter query + storage verification
3. **Removing URLs**: DELETE /api/blacklist/:url endpoint → TCP DELETE command → Storage removal (Bloom filter bits remain set)

### Bloom Filter Logic
- **Insertion**: URLs are hashed using multiple hash functions, corresponding bits set to 1 in filter array
- **Query**: URL hashed with same functions, all corresponding bits checked:
  - If any bit is 0: URL definitely NOT blacklisted
  - If all bits are 1: URL MIGHT be blacklisted (verified against storage for accuracy)
- **False Positives**: Possible but rare; manual storage check provides definitive answer
- **False Negatives**: Impossible due to Bloom filter mathematical properties

## Setup & Running

**Prerequisites:** Docker must be installed and running.
### Method 1: Using Docker Compose (Recommended)


1. **Run the Complete System:**
   ```bash
   docker-compose up --build
   ```
   
2. **Access the Services:**
   - Email API: `http://localhost:9000/api/`
   - Blacklist Server: TCP connection on `localhost:8091`

3. **Stop the System:**
   ```bash
   docker-compose down
   ```

### Method 2: Manual Docker Setup

1. **Build Docker Images:**
   ```bash
   # Navigate to src directory
   cd src
   
   # Build blacklist server
   docker build -f config/DockerServer -t docker-server .
   
   # Build JavaScript server
   docker build -f config/DockerJs -t docker-js .
   ```

2. **Create Docker Network:**
   ```bash
   docker network create ap-email-net
   ```

3. **Run Blacklist Server:**
   ```bash
   # Create data directory for persistence
   mkdir -p ../data
   
   # Run blacklist server with Bloom filter settings: port=8091, size=32, hash_functions=2, seed=5
   docker run -d --name docker-server --network ap-email-net \
     -p 8091:8091 -v "$(pwd)/../data:/Ap_Email/data" \
     docker-server 8091 32 2 5
   ```

4. **Run JavaScript Email Server:**
   ```bash
   docker run -d --name docker-js --network ap-email-net \
     -p 9000:9000 docker-js
   ```

### Method 3: Using Provided Scripts

1. **Start Blacklist Server:**
   ```bash
   cd src
   chmod +x start-server.sh
   ./start-server.sh
   ```

2. **Start JavaScript Server (in separate terminal):**
   ```bash
   cd src
   chmod +x start-js-server.sh
   ./start-js-server.sh
   ```
## Example Run:


Below is an example illustrating how the project runs:


## Takeaways from task 1 relating to SOLID:
In general, lack of documentation harmed the ability to work and understand code which was written by other teammates in part Regarding the following questions:
1. Did changing command names change anything in code which was supposed to be SOLID? No, In the implementation a map data structure was initialized which receives a key value and pairs it with a specific ICommand object, so given input from the user the map would execute the relevant command.
In the new implementation with the new names all we had to do is change the key value from a number to string.
2. Did adding command names change anything in code which was supposed to be SOLID? No, as explained we conveniently just added more commands with keys to the map without altering any other code.
3. Did command output change anything in code which was supposed to be SOLID? Yes, before part 2 the commands never returned any output to the function that called them, more specifically the ICommands printed straight to the terminal instead of returning a string, in the new implementation we added return type so that regardless of what each command sent it would be delivered to the client.
4. Did commands coming from sockets rather than console change anything in code which was supposed to be SOLID? Partially. CLI which is the object type that handles I/O with a user was added a new member - sock -> the client socket, so instead of printing to a terminal the output from the commands would be sent to the client, the rest of the structure remained the same. The storage had to be updated to receive input from the socket and not tight-coupling with text from console.
