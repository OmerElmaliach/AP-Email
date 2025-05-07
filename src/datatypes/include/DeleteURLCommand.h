
#ifndef ADD_URL_COMMAND_H
#define ADD_URL_COMMAND_H

#include <cstddef>
#include <string>



#include <MyHash.h>
#include <Istorage.h>
#include <Icommand.h>
#include <bloomFilterStorage.h>
#include <BloomFilter.h>



/**
 * @class AddURLCommand
 * @brief Handles the addition of a new URL to the system.
 *
 * This command performs the following operations:
 * 1. checks if selected url exists in lists with check
 * 2. Passes the URL through a Bloom filter to convert it into a bit array.
 * 3. Saves the array to a file for future checks.
 *
 * Inherits from the Icommand interface to support command-based execution.
 */
class DeleteURLCommand : public Icommand{
private:
    // the class incharge of IO with the system
    bloomFilterStorage& m_storage;
    
    BloomFilter<std::string, MyHash>& m_bloomFilter;

public:
    //constructor
    DeleteURLCommand(bloomFilterStorage& storage, BloomFilter<std::string, MyHash>& bloomFilter);

    std::string executeCommand( const std::string& URL) override;

};



#endif














