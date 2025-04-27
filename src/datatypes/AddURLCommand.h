
#ifndef ADD_URL_COMMAND_H
#define ADD_URL_COMMAND_H

#include <cstddef>
#include <string>

#include "Istorage.h"
#include "Icommand.h"
#include "MyHash.h"
#include "BloomFilter.h"
#include "bloomFilterStorage.h"



/**
 * @class AddURLCommand
 * @brief Handles the addition of a new URL to the system.
 *
 * This command performs the following operations:
 * 1. Adds the provided URL to a specified destination (e.g., file or storage).
 * 2. Passes the URL through a Bloom filter to convert it into a bit array.
 * 3. Saves the array to a file for future checks.
 *
 * Inherits from the Icommand interface to support command-based execution.
 */
class AddURLCommand : public Icommand{
private:
    // the class incharge of IO with the system
    bloomFilterStorage& m_storage;
    
    BloomFilter<std::string, MyHash>& m_bloomFilter;

public:
    //constructor
    AddURLCommand(bloomFilterStorage& storage, BloomFilter<std::string, MyHash>& bloomFilter);

    void executeCommand( const std::string& URL) override;

};



#endif














