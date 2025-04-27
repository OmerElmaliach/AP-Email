#include <string>
#include <vector>
#include <cstddef>

#include "MyHash.h"
#include "Istorage.h"
#include "Icommand.h"
#include "bloomFilterStorage.h"
#include "BloomFilter.h"
#include "AddURLCommand.h"


#include <iostream>

using namespace std;

    //constructor
    AddURLCommand::AddURLCommand(bloomFilterStorage& storage, BloomFilter<std::string, MyHash>& bloomFilter):
                m_storage(storage), m_bloomFilter(bloomFilter){}


    // will add the URL to url's file, run it through the bloomfilter and save the array in the array's file
    void AddURLCommand::executeCommand( const std::string& URL)  {
        //save URL in its file
        m_storage.save(URL);

        //get hash function numbers
        vector<int> hashes = m_storage.loadInput();
        // cell one has trash value (the array size)
        std::size_t length = hashes.size();

        //set array size to correct size, first arg of input      
        m_bloomFilter.setArraySize(hashes[0]);

        //for eatch cell build the myhash and pass it to the blood
        MyHash myHash(hashes[0]);

        for (size_t i = 1; i < length; i++)
        {   
            myHash.setRounds(hashes[i]);
            //were making a new hash with myhash and sending it to the bloom
            m_bloomFilter.setHash(myHash);
            //the blood uses this hash to filter the key, in out care the URL
            m_bloomFilter.filter(URL);
            //we keep doing that for every hash
        }

        //in the end we get the final result 
        vector<char> bitArrayToSave = m_bloomFilter.getFiltered();
        m_storage.save(bitArrayToSave); //TODO: Gabi- this needs to be a char vec, ok?  
        //all is saved yay! reset the bloomFilter array to all 0's and were done
        m_bloomFilter.resetBitArray();   

    }









