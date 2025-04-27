# AP-Email
link to repo - 
https://github.com/OmerElmaliach/AP-Email

link to jira -
https://omerelmaliachprivate.atlassian.net/jira/software/projects/AE/summary

the flow process of our work and SCRUM meeting summaries can all be found under the user story "Manage project process"

## Overview

This project implements a URL filtering system using a Bloom filter. The system allows users to add URLs to a blacklist and check if a given URL is potentially blacklisted. It leverages the speed and memory efficiency of Bloom filters to quickly determine potential membership in the blacklist.

## Architecture

The system follows the structure outlined in the provided UML diagram:

![UML diagram](https://github.com/user-attachments/assets/1245ecc6-7f5c-4943-bf17-f817982fa043)


* **main()**: Entry point, runs the `App`.
* **App**: Manages the application flow and uses the `CLI`.
* **CLI**: Provides the command-line interface, allowing users to `addURL` and `checkURL`. It utilizes the `BloomFilter` and `BloomFilterStorage`.
* **BloomFilter**: The core probabilistic data structure. It uses `myHash` for hashing URLs and provides `insert` and `query` operations.
* **myHash**: Provides the hashing function(s) needed by the `BloomFilter`.
* **BloomFilterStorage**: Handles saving and loading the Bloom filter state to persistent storage (extending `FileStorage`).
* **FileStorage**: Implements the `IStorage` interface for file-based persistence.
* **IStorage**: Interface defining `save`, `load` etc. operations.
* **ICommand**: Interface for command pattern implementation (e.g., `AddURL`, `CheckURL`).
* **AddURL / CheckURL**: Concrete command classes implementing `execute` based on the `ICommand` interface.

## How it Works

1.  **Initialization**: On startup, the application loads any previously saved Bloom filter state from storage. The Bloom filter's size and the hash functions used are configured initially.
2.  **Adding URLs (Blacklisting)**: When a user adds a URL via the `addURL` command, the URL is hashed multiple times using the configured hash functions. The bits in the Bloom filter array corresponding to the hash results are set to 1[cite: 20, 23]. The updated filter state is saved.
3.  **Checking URLs**: When a user checks a URL via the `checkURL` command, the URL is hashed using the same hash functions. The system checks if *all* corresponding bits in the Bloom filter array are set to 1.
    * If any corresponding bit is 0, the URL is definitively *not* blacklisted.
    * If all corresponding bits are 1, the URL *might* be blacklisted. Bloom filters can produce false positives (indicating a URL is blacklisted when it isn't) but never false negatives. These are checked manually through the URL storage in the bloomFilterStorage.

## Setup & Running

**Prerequisites:** Docker must be installed and running.

**Using script:**

If you have the `start.sh` script, you can run it directly:

```bash
chmod +x start.sh
./start.sh
```
**Alternative: using a docker image directly:**
1.  **Build the Docker Image:**
    Open a terminal in the project's root directory (where `DockerMain` is located) and run:
    ```bash
    docker build -f DockerMain -t bloom-filter-app .
    ```

2.  **Run the Application:**
    ```bash
    docker run -it bloom-filter-app
    ```
    * The `-it` flags allow you to interact with the application (provide input).
    * The application expects the first line of input to define the Bloom filter size and hash functions, followed by commands (`1 [URL]` to add, `2 [URL]` to check).

