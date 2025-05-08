
#ifndef CHECK_URL_COMMAND_H
#define CHECK_URL_COMMAND_H


#include <cstddef>
#include <string>

#include <Istorage.h>
#include <Icommand.h>
#include <MyHash.h>
#include <BloomFilter.h>
#include <bloomFilterStorage.h>

/**
 * @class CheckURLCommand
 * @brief Handles the checking if a URL has ben added to the system
 *
 *  will retun std::string "200 Ok\n\n", then-
 *  
 *  first does a quick check in the bloom filter array file   
 *  if theres a match Concatenates "true"
 *  check the actuall URL file to see if theres a match 
 *  if theres a match Concatenates "true" if not "false"
 *  if failed to upen files will catch the exeption and return "fail"
 *
 * Inherits from the Icommand interface to support command-based execution.
 */
class CheckURLCommand : public Icommand{
private:
    // the class incharge of IO with the system
    bloomFilterStorage& m_storage;
    
    BloomFilter<std::string, MyHash>& m_bloomFilter;

public:
    //constructor
    CheckURLCommand(bloomFilterStorage& storage, BloomFilter<std::string, MyHash>& bloomFilter);

    std::string executeCommand(const std::string& URL) override;

};





#endif 












