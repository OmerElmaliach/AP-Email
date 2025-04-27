#include "fileStorage.h"
#include "bloomFilterStorage.h"
#include <fstream>
#include <filesystem>
#include <stdexcept>
#include "Istorage.h"
#include <string>
#include <vector>
#include <optional>
#include <memory>
#include <sstream>


using namespace std;

    bloomFilterStorage::bloomFilterStorage() : fileStorage("bloomFilterStorage.txt") {
        input = new fileStorage("input.txt");
        urls = new fileStorage("urls.txt");
        filter = new fileStorage("filter.txt");
    }
    bloomFilterStorage::bloomFilterStorage(const vector<int>& inputData, const string& urlsData, const int* filterData)
        : fileStorage("bloomFilterStorage.txt") {
        input = new fileStorage("input.txt");
        urls = new fileStorage("urls.txt");
        filter = new fileStorage("filter.txt");

        input->save(convertVectorToString(inputData));
        urls->save(urlsData);
        filter->save(convertIntToString(filterData));
    }
    bloomFilterStorage::~bloomFilterStorage() {
        delete input;
        delete urls;
        delete filter;
    }
    void bloomFilterStorage::save(const string& data) {
        urls->save(data);
    }
    void bloomFilterStorage::save(const vector<int> data) {
        input->save(convertVectorToString(data));
    }
    void bloomFilterStorage::save(const int* data) {
        filter->save(convertIntToString(data));
    }
    vector<int> bloomFilterStorage::loadInput() {
        string data = input->load().value_or("");
        return convertStringToVector(data);
    }
    string bloomFilterStorage::loadUrls() {
        return urls->load().value_or("");
    }
    int* bloomFilterStorage::loadFilterArray() {
        string data = filter->load().value_or("");
        return convertStringToInt(data);
    }
    bloomFilterStorage& bloomFilterStorage::loadBloomFilter() {
        return *this;
    }
    bool bloomFilterStorage::exists() const {
        return input->exists() || urls->exists() || filter->exists();
    }
    bool bloomFilterStorage::exists(const string& data) const {
        return urls->exists(data);
    }
    bool bloomFilterStorage::exists(const vector<int> data) {
        return input->exists(convertVectorToString(data));
    }
    bool bloomFilterStorage::exists(const int* data) {
        return filter->exists(convertIntToString(data));
    }
    void bloomFilterStorage::remove(const string& data) {
        urls->remove(data);
    }
    void bloomFilterStorage::remove(const vector<int> data) {
        input->remove(convertVectorToString(data));
    }
    void bloomFilterStorage::remove(const int* data) {
        filter->remove(convertIntToString(data));
    }
    void bloomFilterStorage::remove() {
        input->remove();
        urls->remove();
        filter->remove();
    }
    string bloomFilterStorage::convertIntToString(const int* data) const {
        if (data == nullptr) {
            return "";
        }
        return to_string(*data);
    }

    string bloomFilterStorage::convertVectorToString(const vector<int>& data) const {
        string result;
        for (const auto& val : data) {
            if (!result.empty()) {
                result += ",";
            }
            result += to_string(val);
        }
        return result;
    }

    vector<int> bloomFilterStorage::convertStringToVector(const string& data) const {
        vector<int> result;
        stringstream ss(data);
        string item;
        while (getline(ss, item, ',')) {
            result.push_back(stoi(item));
        }
        return result;
    }

    int* bloomFilterStorage::convertStringToInt(const string& data) const {
        if (data.empty()) {
            return nullptr;
        }
        int* result = new int(stoi(data));
        return result;
    }
    

    
    
;
