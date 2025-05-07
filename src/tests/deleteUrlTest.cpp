#include <gtest/gtest.h>
#include <string>
#include <vector>
#include <cstddef>
#include <iostream>
#include <AddURLCommand.h>
#include <Icommand.h>
#include <CheckURLCommand.h>
#include <bloomFilterStorage.h>
#include <MyHash.h>
#include <BloomFilter.h>
#include <DeleteURLCommand.h>

TEST(BloomFilterTest, DeleteURLPrintsTrue) {
    bloomFilterStorage storage;
    std::vector<int> data = {2, 1, 2, 3};

    MyHash hash(10);  // Create a hash with 10 rounds
    BloomFilter<std::string, MyHash> bf(hash, 2);  // Specify template parameters
    storage.save(data);

    std::string url = "hello.com";
    std::string url2= "whynot";
    AddURLCommand addURLCommand{storage, bf};
    CheckURLCommand checkURLCommand{storage, bf};
    DeleteURLCommand deleteURLCommand{storage, bf};

    //check that addURL reyruns the correct string
    std::string ADDresult = addURLCommand.executeCommand(url);
    EXPECT_EQ(ADDresult, "201 Created");

    //test the delete retuns correct output in case url exists in list
    std::string deleteResult = deleteURLCommand.executeCommand(url);    
    EXPECT_EQ(deleteResult,"204 No Content");


    //test the delete retuns correct output in case url dosnt exists in list
    std::string deleteResult2 = deleteURLCommand.executeCommand(url2);    
    EXPECT_EQ(deleteResult2, "404 Not Found");

     /*check that acutally deleted. so "check" will get a true from bloomfilter but a flase from actuall list
      and that checkURL can return a true false output*/
     std::string CHECKresult2 = checkURLCommand.executeCommand(url);    
     EXPECT_EQ(CHECKresult2, "200 Ok\n\ntrue false");
 

}


