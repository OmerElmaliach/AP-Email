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

TEST(BloomFilterTest, CheckURLPrintsTrue) {
    bloomFilterStorage storage;
    std::vector<int> data = {2, 1, 2, 3};

    MyHash hash(10);  // Create a hash with 10 rounds
    BloomFilter<std::string, MyHash> bf(hash, 2);  // Specify template parameters
    storage.save(data);

    std::string url = "hello.com";
    std::string url2= "whynot";
    AddURLCommand addURLCommand{storage, bf};
    CheckURLCommand checkURLCommand{storage, bf};

    //check that addURL reyruns the correct string
    char* ADDresult = addURLCommand.executeCommand(url);
    EXPECT_STREQ(ADDresult, "201 Created");

    //test the checkurl retuns correct out put in case of bloom and urlList conatining the url
    char* CHECKresult = checkURLCommand.executeCommand(url);    
    EXPECT_STREQ(CHECKresult, "200 Ok\n\ntrue true");


    //test the checkurl retuns correct out put in case of bloom and urlList not conatining the url
    char* CHECKresult2 = checkURLCommand.executeCommand(url2);    
    EXPECT_STREQ(CHECKresult2, "200 Ok\n\nfalse");


}


