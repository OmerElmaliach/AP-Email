#ifndef IMENU_H
#define IMENU_H

#include <map>
#include "icommand.h"
#include "Istorage.h"
using namespace std;

// IMenu abstract class.
template<class T, class S>
class IMenu {
protected:
    std::map<T, ICommand*> m_cmdMap;
    bool m_menuState; // True if running, otherwise false.


    /**
     * @brief Initializes the inteface of the menu and handles input.
     */
    virtual void run() = 0;


    /**
     * @brief Adds new menu commands for the user.
     * 
     * @param t Input to trigger a command.
     * @param command Command to be executed.
     */
    virtual void registerCommand(T& t, ICommand* command) = 0;

    
    /**
     * @brief Finds the corresponding command to t in the map and executes the command.
     * 
     * @param t Input to trigger a command.
     */
    virtual void executeCommand(T& t, S& s) = 0;


    /**
     * @brief returns true if menu is still running, otherwise false.
     */
    virtual bool isRunning() = 0;


    /**
     * @brief exits the menu.
     */
    virtual void exit() = 0;
};

#endif