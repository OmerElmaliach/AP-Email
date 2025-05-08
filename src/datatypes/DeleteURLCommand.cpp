
#include <string>
#include <vector>
#include <cstddef>
#include <iostream>
#include <sstream>

#include <MyHash.h>
#include <Istorage.h>
#include <Icommand.h>
#include <bloomFilterStorage.h>
#include <BloomFilter.h>
#include <DeleteURLCommand.h>

using namespace std;


    //constructor
    DeleteURLCommand::DeleteURLCommand(bloomFilterStorage& storage, BloomFilter<std::string, MyHash>& bloomFilter):
                m_storage(storage), m_bloomFilter(bloomFilter){}

    // will add the URL to url's file, run it through the bloomfilter and save the array in the array's file
    std::string DeleteURLCommand::executeCommand(const std::string& URL)  {
        // we put a "try" for accessing storage 
        try
        {
        //convert to bloom to see if similer arrray is in the array file       
        //get hash function parameters
        vector<int> hashes = m_storage.loadInput();

        std::size_t length = hashes.size();

        //set array size to correct size, first arg of input      
        m_bloomFilter.setArraySize(hashes[0]);

        // creat myhash obj
        MyHash myHash(hashes[0]);
        //for eatch cell set the myhash number of rounds and pass it to the bloom
        for (size_t i = 1; i < length; i++)
        {   
            myHash.setRounds(hashes[i]);
            //were making a new hash with myhash and sending it to the bloom
            m_bloomFilter.setHash(myHash);
            //the bloom uses this hash to filter the key, in out care the URL
            m_bloomFilter.filter(URL);
            //we keep doing that for every hash
        }

        //in the end we get the final result 
        vector<char> bitsToCheck = m_bloomFilter.getFiltered();
        // check if every bit in url filter is on in bloomfilter
        vector<char> filterdArray = m_storage.loadFilterArray();

        bool flag  = true;
        size_t len = filterdArray.size(); 
        //check that url filtered was added to bloom filter
        for (size_t i = 0; i < len; i++)
        {   
            // for every bit "on" in url make sure its on in bloom filter
            if (bitsToCheck[i] == 1 && filterdArray[i] != 1 ){
                flag = false;
                break;
            }
        }
        
        // if url matches filter and is indded in URL list, remove it and return 
        if (flag && m_storage.exists(URL))
        {   
            m_storage.remove(URL);     
            m_bloomFilter.resetBitArray();   
            return "204 No Content";
        }

        }// all that was in a "try" incase storage failed
        catch(const std::exception& e)
        {   // retun fail flag
            return "404 Not Found";
        }
        
        //were done reset the bloomFilter array to all 0's and return
        m_bloomFilter.resetBitArray();   
        //if we got here, there isnt a url in the list
        return "404 Not Found";
 

    }






































