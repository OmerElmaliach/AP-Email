/**
 * @file Istorage.h
 * @brief Defines the IStorage interface for generic storage operations.
 */
#ifndef ISTORAGE_H
#define ISTORAGE_H

#include <string>
#include <vector>
#include <optional>

using namespace std;

/**
 * @class IStorage
 * @brief Interface for storage classes supporting save, load, exists, and remove operations.
 */
class IStorage {
public:
    virtual ~IStorage() = default;
    
    /**
     * @brief Save a string to storage.
     * @param data The string data to save.
     */
    virtual void save(const string& data) = 0;
    
    /**
     * @brief Load all data from storage.
     * @return The loaded data as a string, or nullopt if not found.
     */
    virtual optional<string> load() = 0;

    /**
     * @brief Load a specific entry from storage.
     * @param data The entry to search for.
     * @return The found entry as a string, or nullopt if not found.
     */
    virtual optional<string> load(const string& data) = 0;
    
    /**
     * @brief Check if any data exists in storage.
     * @return True if data exists, false otherwise.
     */
    virtual bool exists() const = 0;

    /**
     * @brief Check if a specific entry exists in storage.
     * @param data The entry to check for.
     * @return True if the entry exists, false otherwise.
     */
    virtual bool exists(const string& data) const = 0;

    /**
     * @brief Remove a specific entry from storage.
     * @param data The entry to remove.
     */
    virtual void remove(const string& data) = 0;

    /**
     * @brief Remove all data from storage.
     */
    virtual void remove() = 0;
};

#endif
