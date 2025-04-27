#include <string>
#include <iostream>
#include <regex>
#include <bits/stdc++.h>
#include "MyHash.h"
#include "BloomFilter.h"
#include "imenu.h"
#include "bloomFilterStorage.h"
#include "Icommand.h"
#include "AddURLCommand.h"
#include "CheckURLCommand.h"
using namespace std;

class CLI : public IMenu<int, string> {
private:
    bloomFilterStorage m_Stor;
    MyHash m_stringHasher;
    BloomFilter<string, MyHash> m_bloomFilter;

    /**
     * @brief Helper function, returns true if input string is in proper format for bloom filter settings input, otherwise false.
     * 
     * @param input String input to be checked.
     */
    bool checkInput(string input) {
        static regex bloomInputRegex("^((?!0+$)\\d+\\s+)((?!0+$)\\d+\\s+)*((?!0+$)\\d+)$");
        return regex_match(input, bloomInputRegex);
    }


    /**
     * @brief Helper function, returns true if input string is in proper format of {number command} {url}, otherwise false.
     * 
     * @param input String input to be checked.
     */
    bool checkRegex(string input) {
        static regex urlRegex("^\\d+\\s+((https?:\\/\\/)?(www\\.)?([a-zA-Z0-9-]+\\.)+[a-zA-Z0-9]{2,})(\\/\\S*)?$");
        return regex_match(input, urlRegex);
    }


    /**
     * @brief Helper function, Returns a vector of strings previously seperated by a delimiter.
     * 
     * @param input String input to be checked.
     */
    vector<string> split(string str, char delimiter) {
        vector<string> vec;
        stringstream ss(str);
        string substring;
        while(getline(ss, substring, delimiter)) {
            vec.push_back(substring);
        }

        return vec;
    }


    /**
     * @brief Adds new menu commands for the user.
     * 
     * @param input Number input to trigger the command.
     * @param command Command to be executed.
     */
    void registerCommand(int& input, Icommand* command) override {
        if (m_cmdMap.find(input) == m_cmdMap.end()) {
            // Command number was not found in map, can insert.
            m_cmdMap.insert({input, command});
        }
    }


    /**
     * @brief Finds the corresponding command to the input number in the map and executes the command.
     * 
     * @param input Input number to trigger a command.
     */
    void executeCommand(int& input, string& str) override {
        if (m_cmdMap.find(input) != m_cmdMap.end()) {
            // Command number was found in map, can perform command.
            m_cmdMap[input]->executeCommand(str);
        }
    }


    /**
     * @brief returns true if menu is still running, otherwise false.
     */
    bool isRunning() override {
        return m_menuState;
    }


    /**
     * @brief exits the menu.
     */
    void exit() override {
        m_menuState = false;
    }


public:
    /**
     * @brief CLI Builder function, defines the menu's state and the ICommands associated with command numbers.
     */
    CLI() : m_stringHasher(1), m_bloomFilter(m_stringHasher) {
        // Initialize the commands with the associated numbers to perform them.
        int addInput = 1, checkNum = 2;
        Icommand* addCmd = new AddURLCommand(m_Stor, m_bloomFilter);
        Icommand* checkCmd = new CheckURLCommand(m_Stor, m_bloomFilter);
        registerCommand(addInput, addCmd);
        registerCommand(checkNum, checkCmd);

        // Menu has not started running yet.
        m_menuState = false;
    }


    /**
     * @brief Initializes the inteface of the menu and handles input.
     */
    void run() override {
        // Menu state is permenantly true since no exit protocol defined.
        m_menuState = true;
        while (isRunning()) {
            string input;
            if (m_Stor.loadInput().empty() && m_Stor.loadFilterArray().empty()) {
                // Storage files do not not exist for bloom filter input.
                do {
                    // Loop until input is in the proper format.
                    getline(cin, input);
                } while(!checkInput(input));
                vector<string> str_vec = split(input, ' ');
                vector<int> input_vec;
                for (string sub : str_vec) {
                    input_vec.push_back(stoi(sub));
                }
                // Save the bloom input settings.
                m_Stor.save(input_vec);
            }
            do {
                // Loop until input is in the proper format for performing commands.
                getline(cin, input);
            } while(!checkRegex(input));
            vector<string> str_vec = split(input, ' ');
            int cmd = stoi(str_vec[0]);
            // Execute the command associated with num in map.
            executeCommand(cmd, str_vec[1]);
        }
    }
};