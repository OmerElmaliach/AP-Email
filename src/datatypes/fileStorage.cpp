#include "Istorage.h"
#include <fstream>
#include <filesystem>
#include <stdexcept>
#include "fileStorage.h"

using namespace std;
template <typename T>

class fileStorage : public IStorage<T> {
private:
    mutable fstream fileStream;
    const string filePath;

    // Helper function to serialize an object to the file
    void saveToFile(const T& object) const {
        fileStream.open(filePath, ios::out | ios::binary | ios::trunc);
        if (!fileStream) {
            throw runtime_error("Failed to open file for saving.");
        }
        fileStream.write(reinterpret_cast<const char*>(&object), sizeof(T));
        fileStream.close();
    }

    // Helper function to deserialize an object from the file
    T loadFromFile() const {
        fileStream.open(filePath, ios::in | ios::binary);
        if (!fileStream) {
            throw runtime_error("Failed to open file for loading.");
        }
        T object;
        fileStream.read(reinterpret_cast<char*>(&object), sizeof(T));
        fileStream.close();
        return object;
    }

public:
    explicit FileStorage(const string& fileName)
        : filePath("../data/" + fileName) {
        // Ensure the ../data directory exists
        filesystem::create_directories("../data");
    }

    void save(const T& object) override {
        saveToFile(object);
    }

    T load() override {
        if (!exists()) {
            throw runtime_error("File does not exist.");
        }
        return loadFromFile();
    }

    void remove() override {
        if (exists()) {
            filesystem::remove(filePath);
        }
    }

    bool exists() const override {
        return filesystem::exists(filePath);
    }
};