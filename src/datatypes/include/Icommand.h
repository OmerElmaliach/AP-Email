
#ifndef ICOMMAND_H
#define ICOMMAND_H

#include <string>

// creating the abstract class for our command design pattern
class Icommand {
public:

 // Virtual destructor
virtual ~Icommand() = default; 

// virtual command methode, the diffrenr command will implament
virtual void executeCommand( const std::string& URL)=0;

};
#endif // ICOMMAND_H






























