
#ifndef DELETE_URL_COMMAND_H
#define DELETE_URL_COMMAND_H


#include <cstddef>
#include <string>



#include <MyHash.h>
#include <Istorage.h>
#include <Icommand.h>
#include <bloomFilterStorage.h>
#include <BloomFilter.h>



/**
 * @class DeleteURLCommand
 * @brief Handles the Deleting of a URL from the system.
 *
 * This command performs the following operations:
 * Passes the URL through a Bloom filter to convert it into a bit array then checks if its on the bloom filter array 
 *  if it is, it then checks if selected url exists in url list 
 *  if indded selected url is on the url lest every intance of it will be deleted 
 * 
 *  if deletes- retuns std::string "204 No Content" if not - will return "404 Not Found"
 * if theres an error in storage handeling will return string "fail"
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














