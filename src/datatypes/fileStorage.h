#ifndef FILESTORAGE_H
#define FILESTORAGE_H

#include "Istorage.h"
#include <fstream>
#include <filesystem>
#include <stdexcept>
#include <string>

using namespace std;

template <typename T>
class fileStorage : public IStorage<T> {
private:
    mutable fstream fileStream;
    const string filePath;

    // Helper function to serialize an object to the file
    void saveToFile(const T& object) const;

    // Helper function to deserialize an object from the file
    T loadFromFile() const;

public:
    explicit fileStorage(const string& fileName);
    
    bool save(const T& object) override;
    
    optional<T> load() const override;
    
    void remove() override;
    void remove(const T& data) override;
    
    bool exists() const override;
};

template <typename T>
fileStorage<T>::fileStorage(const string& fileName)
    : filePath("../data/" + fileName) {
    // Ensure the ../data directory exists
    filesystem::create_directories("../data");
}

template <typename T>
void fileStorage<T>::saveToFile(const T& object) const {
    fileStream.open(filePath, ios::out | ios::binary | ios::trunc);
    if (!fileStream) {
        throw runtime_error("Failed to open file for saving.");
    }
    fileStream.write(reinterpret_cast<const char*>(&object), sizeof(T));
    fileStream.close();
}

template <typename T>
T fileStorage<T>::loadFromFile() const {
    fileStream.open(filePath, ios::in | ios::binary);
    if (!fileStream) {
        throw runtime_error("Failed to open file for loading.");
    }
    T object;
    fileStream.read(reinterpret_cast<char*>(&object), sizeof(T));
    fileStream.close();
    return object;
}

template <typename T>
bool fileStorage<T>::save(const T& object) {
    try {
        saveToFile(object);
        return true;
    } catch (const exception& e) {
        return false;
    }
}

template <typename T>
optional<T> fileStorage<T>::load() const {
    if (!exists()) {
        return nullopt;
    }
    try {
        return loadFromFile();
    } catch (const exception& e) {
        return nullopt;
    }
}

template <typename T>
void fileStorage<T>::remove() {
    if (exists()) {
        filesystem::remove(filePath);
    }
}

template <typename T>
void fileStorage<T>::remove(const T& data) {
    // For a simple file implementation, removing specific data
    // typically involves loading all data, removing the specified item,
    // and saving it back.
    
    // This is a simplified implementation where we just check if the data is what we have,
    // and if so, remove the entire file. In a real implementation, you would handle
    // collections of data differently.
    
    if (exists()) {
        auto current = load();
        if (current.has_value() && current.value() == data) {
            remove();
        }
    }
}

template <typename T>
bool fileStorage<T>::exists() const {
    return filesystem::exists(filePath);
}

#endif