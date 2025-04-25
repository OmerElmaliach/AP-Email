#ifndef ISTORAGE_H
#define ISTORAGE_H

#include <string>
#include <vector>
#include <optional>

using namespace std;
template <typename T>
class IStorage {
public:
    virtual ~IStorage() = default;
    
    // Save data to storage
    virtual bool save(const T& data) = 0;
    
    // Load data from storage. Void call loads the whole file
    virtual optional<T> load() = 0;
    
    // Check if data exists in storage
    virtual bool exists() const = 0;

    // Remove data from storage
    virtual void remove(const T& data) = 0;
};

#endif
