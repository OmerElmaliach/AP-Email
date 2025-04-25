#ifndef FILESTORAGE_H
#define FILESTORAGE_H

#include "Istorage.h"
#include <fstream>
#include <filesystem>
#include <stdexcept>

using namespace std;
template <typename T>

class fileStorage : public IStorage<T> {
private:
    mutable fstream fileStream;
    const string filePath;

    // Helper function to serialize an object to the file
    void saveToFile(const T& object) const = 0;

    // Helper function to deserialize an object from the file
    T loadFromFile() const = 0;

public:
    explicit FileStorage(const string& fileName)
        : filePath("../data/" + fileName);

    void save(const T& object) override;

    T load() override;

    void remove() override;

    bool exists() const override;
};

#endif
