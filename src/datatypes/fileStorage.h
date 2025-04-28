#ifndef FILESTORAGE_H
#define FILESTORAGE_H

#include "Istorage.h"
#include <fstream>
#include <filesystem>
#include <stdexcept>
#include <vector>

using namespace std;

class fileStorage : public IStorage {
private:
    mutable fstream fileStream;
    const string filePath;


    // Helper function to serialize an object to the file
    void saveToFile(const string& object);

    // Helper function to read all entries from the file
    vector<string> loadAllFromFile();

protected:

    // Helper function to convert int* to string
    string convertIntToString(const int* data) const;

    // Helper function to convert vector<int> to string
    string convertVectorToString(const vector<int>& data) const;

    string convertVectorToString(const vector<int>& data) const;

    // Helper function to serialize an object to the file in a truncated manner
    // (overwrites the file content)

    void saveTruncToFile(const string& object);

public:

    explicit fileStorage(const string& fileName);

    void save(const string& data) override;

    void save(const vector<int>& data);

    void save(const vector<char>& data);

    optional<string> load() override;

    optional<string> load(const string& data) override;

    void remove(const string& data) override;

    void remove() override;

    bool exists() const override;

    bool exists(const string& data) const override;
};

#endif
