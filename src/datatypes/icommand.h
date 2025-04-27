
#ifndef ICOMMAND_H
#define ICOMMAND_H

// creating the abstract class for our command design pattern
class Icommand {
public:

 // Virtual destructor
virtual ~Icommand() = default; 

// virtual command methode, the diffrenr command will implament
virtual void executeCommand()=0;

};
#endif // ICOMMAND_H






























