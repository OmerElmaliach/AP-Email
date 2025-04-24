#include "imenu.h"
using namespace std;

class CLI : public IMenu<int>{
public:
    /**
     * @brief CLI Builder function, defines the menu's state and the ICommands associated with command numbers.
     */
    CLI() {
        // Initialize the commands with the associated numbers to perform them.
        int addInput = 1, checkNum = 2;
        ICommand* addCmd = new AddURL();
        ICommand* checkCmd = new CheckURL();
        registerCommand(addInput, addCmd);
        registerCommand(checkNum, checkCmd);

        // Menu has not started running yet.
        m_menuState = false;
    }


    /**
     * @brief Initializes the inteface of the menu and handles input.
     */
    void run() override {
        // TODO
    }


    /**
     * @brief Adds new menu commands for the user.
     * 
     * @param input Number input to trigger the command.
     * @param command Command to be executed.
     */
    void registerCommand(int& input, ICommand* command) override {
        m_cmdMap.insert({input, command});
    }


    /**
     * @brief Finds the corresponding command to the input number in the map and executes the command.
     * 
     * @param input Input number to trigger a command.
     */
    void executeCommand(int& input) override {
        m_cmdMap[input]->execute();
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
};