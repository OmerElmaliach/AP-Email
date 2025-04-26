#include "Istorage.h"
#include <fstream>
#include <filesystem>
#include <stdexcept>
#include "fileStorage.h"
#include <iostream>
#include <string>
#include <vector>
#include <optional>
#include <memory>

using namespace std;
using namespace std::filesystem;

fileStorage::fileStorage(const string& fileName)
    : filePath("../data/" + fileName) {  // Initialize the member variable using initializer list
    // Ensure the ../data directory exists (not the full path including filename)
    filesystem::create_directories("../data");
    
    // Create an empty file if it doesn't exist already
    if (!filesystem::exists(filePath)) {
        ofstream file(filePath);
        file.close();
    }
}

// Helper function to serialize an object to the file
void fileStorage::saveToFile(const string& object) {
    fileStream.open(filePath, ios::out | ios::binary | ios::trunc);
    if (!fileStream) {
        throw runtime_error("Failed to open file for saving.");
    }
    fileStream.write(object.c_str(), object.size());
    fileStream.close();
}

// Helper function to deserialize an object from the file
string fileStorage::loadFromFile() {
    fileStream.open(filePath, ios::in | ios::binary);
    if (!fileStream) {
        throw runtime_error("Failed to open file for loading.");
    }
    
    // Get file size
    fileStream.seekg(0, ios::end);
    streamsize size = fileStream.tellg();
    fileStream.seekg(0, ios::beg);
    
    // Read the entire file content
    string content(size, ' ');
    if (size > 0) {
        fileStream.read(&content[0], size);
    }
    
    fileStream.close();
    return content;
}

void fileStorage::save(const string& data) {
    saveToFile(data);
}

optional<string> fileStorage::load() {
    if (!exists()) {
        return nullopt;
    }
    try {
        return loadFromFile();
    } catch (const exception& e) {
        return nullopt;
    }
}

optional<string> fileStorage::load(const string& data) {
    if (!exists()) {
        return nullopt;
    }
    try {
        string data = loadFromFile();
        return data;
    } catch (const exception& e) {
        return nullopt;
    }
}

void fileStorage::remove(const string& data) {
    remove(); // For simplicity, we're just removing the whole file
}

void fileStorage::remove() {
    if (exists()) {
        filesystem::remove(filePath);
    }
}

bool fileStorage::exists() const {
    return filesystem::exists(filePath);
}

bool fileStorage::exists(const string& data) const {
    if (!exists()) {
        return false;
    }
    
    try {
        fileStream.open(filePath, ios::in | ios::binary);
        if (!fileStream) {
            return false;
        }
        
        // Get file size
        fileStream.seekg(0, ios::end);
        streamsize size = fileStream.tellg();
        fileStream.seekg(0, ios::beg);
        
        // Read the entire file content
        string content(size, ' ');
        if (size > 0) {
            fileStream.read(&content[0], size);
        }
        
        fileStream.close();
        return content == data;
    } catch (const exception& e) {
        return false;
    }
}

string fileStorage::convertIntToString(const int* data) const {
    if (data == nullptr) {
        return "";
    }
    return to_string(*data);
}

string fileStorage::convertVectorToString(const vector<int>& data) const {
    string result;
    for (const auto& val : data) {
        if (!result.empty()) {
            result += ",";
        }
        result += to_string(val);
    }
    return result;
}