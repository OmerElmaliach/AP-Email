#include <string>
#include <vector>
#include <cstddef>
#include <iostream>

#include "MyHash.h"
#include "Istorage.h"
#include "Icommand.h"
#include "bloomFilterStorage.h"
#include "BloomFilter.h"
#include "CheckURLCommand.h"

using namespace std;


    //constructor
    CheckURLCommand::CheckURLCommand(bloomFilterStorage& storage, const std::string& URL, BloomFilter<std::string, MyHash>& bloomFilter):
                m_storage(storage), m_URL(URL), m_bloomFilter(bloomFilter){}

    // will add the URL to url's file, run it through the bloomfilter and save the array in the array's file
    void CheckURLCommand::executeCommand()  {
        
        //convert to bloom to see if similer arrray is in the array file

        //get hash function numbers
        vector<int> hashes = m_storage.loadInput();
        // cell one has trash value (the array size)
        std::size_t length = hashes.size();
        //for eatch cell build the myhash and pass it to the bloom
        MyHash myHash(hashes[0]);
        cout << "TESTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT 1";

        for (size_t i = 1; i < length; i++)
        {   
            myHash.setRounds(hashes[i]);
            //were making a new hash with myhash and sending it to the bloom
            m_bloomFilter.setHash(myHash);
            //the bloom uses this hash to filter the key, in out care the URL
            m_bloomFilter.filter(m_URL);
            //we keep doing that for every hash
        }

        //in the end we get the final result 
        vector<char> bitArrayToCheck = m_bloomFilter.getFiltered();

        cout << "TESTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT 2";

        if (m_storage.exists(bitArrayToCheck))
        {
            cout << "true ";
             //final test if in the URL file
            if ( m_storage.exists(m_URL))
            {
                cout << "true" << endl;
            }else{
                //else not in url list so false
                cout << "false" << endl;
            }
            //not in array then right away flase
        }else{
            cout << "false" << endl;
        }
                    
        //were done reset the bloomFilter array to all 0's and return
        m_bloomFilter.resetBitArray();   
    }






































