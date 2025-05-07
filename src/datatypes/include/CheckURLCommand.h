
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
 * This command performs the following operations:
 * 1.first does a quick check in the bloom filter array file  
 * 2. if theres a match prints posotive
 * 3. check the actuall URL file to see if theres a match 
 * 4. if theres a match prints posotive if not negative

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












