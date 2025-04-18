#include <map>
#include "icommand.h"
using namespace std;

// IMenu abstract class.
template<class T>
class IMenu {
protected:
    std::map<T, ICommand> m_cmdMap;

    /**
     * @brief Adds new menu commands for the user.
     * 
     * @param t Input to trigger a command.
     * @param command Command to be executed.
     */
    virtual void registerCommand(T t, ICommand command) = 0;


};