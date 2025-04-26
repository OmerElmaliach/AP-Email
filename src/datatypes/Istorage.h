#ifndef ISTORAGE_H
#define ISTORAGE_H

#include <string>
#include <vector>
#include <optional>

using namespace std;

class IStorage {
public:
    virtual ~IStorage() = default;
    
    // Save data to storage
    virtual void save(const string& data) = 0;
    
    // Load data from storage. Void call loads the whole file
    virtual optional<string> load() = 0;

    virtual optional<string> load(const string& data) = 0;
    
    // Check if data exists in storage
    virtual bool exists() const = 0;

    virtual bool exists(const string& data) const = 0;

    // Remove data from storage
    virtual void remove(const string& data) = 0;

    // Remove all data from storage
    virtual void remove() = 0;
};

#endif
