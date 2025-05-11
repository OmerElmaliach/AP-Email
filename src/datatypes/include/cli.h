#include <string>
#include <iostream>
#include <regex>
#include <bits/stdc++.h>
#include <MyHash.h>
#include <BloomFilter.h>
#include <imenu.h>
#include <bloomFilterStorage.h>
#include <Icommand.h>
#include <AddURLCommand.h>
#include <CheckURLCommand.h>
#include <DeleteURLCommand.h>
#include <sys/socket.h>
using namespace std;

class CLI : public IMenu<string, string> {
private:

    MyHash m_stringHasher;
    BloomFilter<string, MyHash> m_bloomFilter;
    int m_sock;

    /**
     * @brief Helper function, returns true if input string is in proper format of {number command} {url}, otherwise false.
     * 
     * @param input String input to be checked.
     */
    bool checkRegex(string input);


    /**
     * @brief Helper function, Returns a vector of strings previously seperated by spaces.
     * 
     * @param input String input to be checked.
     */
    vector<string> split(string str);



    /**
     * @brief Adds new menu commands for the user.
     * 
     * @param input Number input to trigger the command.
     * @param command Command to be executed.
     */
    void registerCommand(string& input, Icommand* command) override;


    /**
     * @brief Finds the corresponding command to the input number in the map and executes the command.
     * 
     * @param input Input number to trigger a command.
     * @param str Input to the ICommand.
     */
    void executeCommand(string& input, string& str) override;


    /**
     * @brief returns true if menu is still running, otherwise false.
     */
    bool isRunning() override;


    /**
     * @brief exits the menu.
     */
    void exit() override;

    
public:
    /**
     * @brief CLI Builder function, defines the menu's state and the ICommands associated with command numbers.
     */
    CLI(int sock, bloomFilterStorage* p_bloomFilterStorage);


    /**
     * @brief Initializes the inteface of the menu and handles input.
     */
    void run() override;
};