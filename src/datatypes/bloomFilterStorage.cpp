#include <fileStorage.h>
#include <bloomFilterStorage.h>
#include <fstream>
#include <filesystem>
#include <stdexcept>
#include <Istorage.h>
#include <string>
#include <vector>
#include <optional>
#include <memory>
#include <sstream>
#include <iostream>
#include <mutex>

using namespace std;

bloomFilterStorage::bloomFilterStorage() : fileStorage("bloomFilterStorage.txt") {
    input = new fileStorage("input.txt");
    urls = new fileStorage("urls.txt");
    filter = new fileStorage("filter.txt");
}

bloomFilterStorage::bloomFilterStorage(const vector<int>& inputData, const string& urlsData, const vector<char> filterData)
    : fileStorage("bloomFilterStorage.txt") {
    input = new fileStorage("input.txt");
    urls = new fileStorage("urls.txt");
    filter = new fileStorage("filter.txt");

    input->save(inputData);
    urls->save(urlsData);
    filter->save(filterData);
}

bloomFilterStorage::~bloomFilterStorage() {
    delete input;
    delete urls;
    delete filter;
}

void bloomFilterStorage::save(const string& data) {
    std::lock_guard<std::mutex> lock(storage_mutex);
    urls->save(data);
}

void bloomFilterStorage::save(const vector<int>& data) {
    std::lock_guard<std::mutex> lock(storage_mutex);
    input->save(data);
}

void bloomFilterStorage::save(const vector<char>& data) {
    std::lock_guard<std::mutex> lock(storage_mutex);
    filter->save(data);
}

vector<int> bloomFilterStorage::loadInput() {
    std::lock_guard<std::mutex> lock(storage_mutex);
    string data = input->load().value_or("");
    return convertStringToIntVector(data);
}

string bloomFilterStorage::loadUrls() {
    std::lock_guard<std::mutex> lock(storage_mutex);
    return urls->load().value_or("");
}

vector<char> bloomFilterStorage::loadFilterArray() {
    std::lock_guard<std::mutex> lock(storage_mutex);
    string data = filter->load().value_or("");
    return convertStringToCharVector(data);
}

bloomFilterStorage& bloomFilterStorage::loadBloomFilter() {
    std::lock_guard<std::mutex> lock(storage_mutex);
    return *this;
}

bool bloomFilterStorage::exists() const {
    std::lock_guard<std::mutex> lock(storage_mutex);
    return input->exists() || urls->exists() || filter->exists();
}

bool bloomFilterStorage::exists(const string& data) const {
    std::lock_guard<std::mutex> lock(storage_mutex);
    return urls->exists(data);
}

bool bloomFilterStorage::exists(const vector<int> data) {
    std::lock_guard<std::mutex> lock(storage_mutex);
    return input->exists(convertVectorIntToString(data));
}

bool bloomFilterStorage::exists(const vector<char> data) {
    std::lock_guard<std::mutex> lock(storage_mutex);
    return filter->exists(convertVectorCharToString(data));
}

void bloomFilterStorage::remove(const string& data) {
    std::lock_guard<std::mutex> lock(storage_mutex);
    urls->remove(data);
}

void bloomFilterStorage::remove(const vector<int>& data) {
    std::lock_guard<std::mutex> lock(storage_mutex);
    input->remove(convertVectorIntToString(data));
}

void bloomFilterStorage::remove(const vector<char>& data) {
    std::lock_guard<std::mutex> lock(storage_mutex);
    filter->remove(convertVectorCharToString(data));
}

void bloomFilterStorage::remove() {
    std::lock_guard<std::mutex> lock(storage_mutex);
    input->remove();
    urls->remove();
    filter->remove();
}

string bloomFilterStorage::convertVectorCharToString(const vector<char>& data) const {
    string result;
    for (const auto& val : data) {
        if (!result.empty()) {
            result += ",";
        }
        // Handle special characters explicitly
        if (isalpha(val)) {
            result += val;
        } else {
            result += to_string(int(val));
        }
    }
    return result;
}

string bloomFilterStorage::convertVectorIntToString(const vector<int>& data) const {
    string result;
    for (const auto& val : data) {
        if (!result.empty()) {
            result += ",";
        }
        result += to_string(val);
    }
    return result;
}

vector<int> bloomFilterStorage::convertStringToIntVector(const string& data) const {
    vector<int> result;
    stringstream ss(data);
    string line;
    
    // Process each line in the data
    while (getline(ss, line, '\n')) {
        stringstream lineStream(line);
        string item;
        
        // Process each comma-separated value in the line
        while (getline(lineStream, item, ',')) {
            if (!item.empty()) {
                try {
                    result.push_back(stoi(item));
                } catch (const std::invalid_argument& e) {
                    // Skip non-numeric values
                    throw std::runtime_error("Invalid input data: " + item);
                }
            }
        }
    }
    return result;
}

vector<char> bloomFilterStorage::convertStringToCharVector(const string& data) const {
    vector<char> result;
    stringstream ss(data);
    string line;
    
    // Process each line in the data
    while (getline(ss, line, '\n')) {
        stringstream lineStream(line);
        string item;
        
        // Process each comma-separated value in the line
        while (getline(lineStream, item, ',')) {
            if (!item.empty()) {
                try {
                    // Check if the item is a single letter character
                    if (item.length() == 1 && isalpha(item[0])) {
                        result.push_back(item[0]);
                    } else {
                        // Try to convert to int and then to char
                        result.push_back(static_cast<char>(stoi(item)));
                    }
                } catch (const std::invalid_argument& e) {
                    // Skip invalid values but log them
                    throw std::runtime_error("Invalid input data: " + item);
                }
            }
        }
    }
    return result;
}
// Include these implementations for the getters and setters from the header
fileStorage& bloomFilterStorage::getInput() {
    return *input;
}

fileStorage& bloomFilterStorage::getUrls() {
    return *urls;
}

fileStorage& bloomFilterStorage::getFilter() {
    return *filter;
};
