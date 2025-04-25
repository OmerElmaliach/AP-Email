#ifndef FILESTORAGE_H
#define FILESTORAGE_H

#include "Istorage.h"
#include <fstream>
#include <string>
#include <optional>
#include <cstdio> // For remove function as alternative to filesystem
#include <sys/stat.h> // For stat function to check if file exists

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

    // Helper function to create directory if it doesn't exist
    void createDirectory(const string& path) const;

public:
    explicit fileStorage(const string& fileName);
    
    bool save(const T& object) override;
    
    std::optional<T> load() const override;
    
    void remove() override;
    void remove(const T& data) override;
    
    bool exists() const override;
};

template <typename T>
void fileStorage<T>::createDirectory(const string& path) const {
    // Create directory using system-specific calls
    #ifdef _WIN32
    system(("mkdir " + path).c_str());
    #else
    system(("mkdir -p " + path).c_str());
    #endif
}

template <typename T>
fileStorage<T>::fileStorage(const string& fileName)
    : filePath("../data/" + fileName) {
    // Ensure the ../data directory exists
    createDirectory("../data");
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
std::optional<T> fileStorage<T>::load() const {
    if (!exists()) {
        return std::nullopt;
    }
    try {
        return loadFromFile();
    } catch (const exception& e) {
        return std::nullopt;
    }
}

template <typename T>
void fileStorage<T>::remove() {
    if (exists()) {
        // Use standard C function to remove file
        std::remove(filePath.c_str());
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
        auto current = this->load();
        if (current.has_value() && current.value() == data) {
            remove();
        }
    }
}

template <typename T>
bool fileStorage<T>::exists() const {
    // Use standard C function to check if file exists
    struct stat buffer;
    return (stat(filePath.c_str(), &buffer) == 0);
}

#endif