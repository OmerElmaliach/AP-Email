/**
 * @file fileStorage.h
 * @brief Defines the fileStorage class for file-based persistent storage.
 */
#ifndef FILESTORAGE_H
#define FILESTORAGE_H

#include <Istorage.h>
#include <fstream>
#include <filesystem>
#include <stdexcept>
#include <vector>

using namespace std;

/**
 * @class fileStorage
 * @brief Implements IStorage for persistent file-based storage of strings and vectors.
 */
class fileStorage : public IStorage {
private:
    mutable fstream fileStream;   ///< File stream for reading/writing.
    const string filePath;        ///< Path to the storage file.

    /**
     * @brief Helper function to append a string to the file.
     * @param object The string to write.
     */
    void saveToFile(const string& object);

    /**
     * @brief Helper function to read all entries from the file.
     * @return Vector of all entries as strings.
     */
    vector<string> loadAllFromFile();

protected:
    /**
     * @brief Convert an int pointer to a string.
     * @param data Pointer to int.
     * @return String representation.
     */
    string convertIntToString(const int* data) const;

    /**
     * @brief Convert a vector of ints to a comma-separated string.
     * @param data Vector of ints.
     * @return Comma-separated string.
     */
    string convertVectorToString(const vector<int>& data) const;

    /**
     * @brief Convert a vector of chars to a comma-separated string.
     * @param data Vector of chars.
     * @return Comma-separated string.
     */
    string convertVectorToString(const vector<char>& data) const;

    /**
     * @brief Helper function to overwrite the file with a string.
     * @param object The string to write.
     */
    void saveTruncToFile(const string& object);

public:
    /**
     * @brief Constructs a fileStorage object for a given file name.
     * @param fileName Name of the file to use for storage.
     */
    explicit fileStorage(const string& fileName);

    /**
     * @brief Save a string to the file (appends).
     * @param data The string to save.
     */
    void save(const string& data) override;

    /**
     * @brief Save a vector of ints to the file (overwrites).
     * @param data The vector to save.
     */
    void save(const vector<int>& data);

    /**
     * @brief Save a vector of chars to the file (overwrites).
     * @param data The vector to save.
     */
    void save(const vector<char>& data);

    /**
     * @brief Load all data from the file.
     * @return All data as a string, or nullopt if not found.
     */
    optional<string> load() override;

    /**
     * @brief Load a specific entry from the file.
     * @param data The entry to search for.
     * @return The found entry as a string, or nullopt if not found.
     */
    optional<string> load(const string& data) override;

    /**
     * @brief Remove a specific entry from the file.
     * @param data The entry to remove.
     */
    void remove(const string& data) override;

    /**
     * @brief Remove all data from the file.
     */
    void remove() override;

    /**
     * @brief Check if the file exists.
     * @return True if the file exists, false otherwise.
     */
    bool exists() const override;

    /**
     * @brief Check if a specific entry exists in the file.
     * @param data The entry to check for.
     * @return True if the entry exists, false otherwise.
     */
    bool exists(const string& data) const override;
};

#endif
