// fileStorage.cpp

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
#include <sstream>

using namespace std;
using namespace std::filesystem;

fileStorage::fileStorage(const string& fileName)
    : filePath("../data/" + fileName) {
    // Ensure the ../data directory exists
    filesystem::create_directories("../data");
    
    // Create an empty file if it doesn't exist already
    if (!filesystem::exists(filePath)) {
        ofstream file(filePath);
        file.close();
    }
}

// Helper function to serialize an object to the file in a truncated manner
// (overwrites the file content)
void fileStorage::saveTruncToFile(const string& object) {
    fileStream.open(filePath, ios::out | ios::trunc);
    if (!fileStream) {
        throw runtime_error("Failed to open file for saving.");
    }
    
    fileStream << object;
    fileStream.close();
}

// Helper function to serialize an object to the file
void fileStorage::saveToFile(const string& object) {
    // First check if the file is empty
    bool isFileEmpty = false;
    
    {
        ifstream checkFile(filePath);
        isFileEmpty = checkFile.peek() == ifstream::traits_type::eof();
    }
    
    // Open in append mode to add the new entry
    fileStream.open(filePath, ios::out | ios::app);
    if (!fileStream) {
        throw runtime_error("Failed to open file for saving.");
    }
    
    // Write the object with a newline only if the file is not empty
    if (!isFileEmpty) {
        fileStream << endl;
    }
    fileStream << object;
    fileStream.close();
}

// Helper function to read all entries from the file
vector<string> fileStorage::loadAllFromFile() {
    vector<string> entries;
    
    fileStream.open(filePath, ios::in);
    if (!fileStream) {
        throw runtime_error("Failed to open file for loading.");
    }
    
    string line;
    while (getline(fileStream, line)) {
        if (!line.empty()) {
            entries.push_back(line);
        }
    }
    
    fileStream.close();
    return entries;
}

void fileStorage::save(const string& data) {
    // Simply append the data to the file
    saveToFile(data);
}

void fileStorage::save(const vector<int>& data) {
    // Simply append the data to the file
    saveTruncToFile(convertVectorToString(data));
}


optional<string> fileStorage::load() {
    if (!exists()) {
        return nullopt;
    }
    
    try {
        vector<string> entries = loadAllFromFile();
        
        // If there are no entries, return nullopt
        if (entries.empty()) {
            return nullopt;
        }
        
        // Join all entries with newlines and return
        stringstream result;
        for (size_t i = 0; i < entries.size(); ++i) {
            if (i > 0) {
                result << "\n";
            }
            result << entries[i];
        }
        
        return result.str();
    } catch (const exception& e) {
        return nullopt;
    }
}

optional<string> fileStorage::load(const string& data) {
    if (!exists()) {
        return nullopt;
    }
    
    try {
        vector<string> entries = loadAllFromFile();
        
        // Look for the specific entry
        for (const auto& entry : entries) {
            if (entry == data) {
                return entry;
            }
        }
        
        // Not found
        return nullopt;
    } catch (const exception& e) {
        return nullopt;
    }
}

void fileStorage::remove(const string& data) {
    if (!exists()) {
        return;
    }
    
    try {
        vector<string> entries = loadAllFromFile();
        
        // Create a new vector without the entry to remove
        vector<string> newEntries;
        for (const auto& entry : entries) {
            if (entry != data) {
                newEntries.push_back(entry);
            }
        }
        
        // Write back the remaining entries
        fileStream.open(filePath, ios::out | ios::trunc);
        if (!fileStream) {
            throw runtime_error("Failed to open file for writing.");
        }
        
        for (size_t i = 0; i < newEntries.size(); ++i) {
            if (i > 0) {
                fileStream << endl;
            }
            fileStream << newEntries[i];
        }
        
        fileStream.close();
    } catch (const exception& e) {
        // Handle the exception
        cerr << "Error in remove: " << e.what() << endl;
    }
}

void fileStorage::remove() {
    if (exists()) {
        filesystem::remove(filePath);
        
        // Recreate an empty file
        ofstream file(filePath);
        file.close();
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
        fileStream.open(filePath, ios::in);
        if (!fileStream) {
            return false;
        }
        
        string line;
        while (getline(fileStream, line)) {
            if (line == data) {
                fileStream.close();
                return true;
            }
        }
        
        fileStream.close();
        return false;
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