#include "bloomFilterStorage.h"
#include "fileStorage.h"
#include "bloomFilterStorage.h"
#include <fstream>
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
    bloomFilterStorage::bloomFilterStorage(const vector<int>& inputData, const string& urlsData, const vector<char> filterData)
        : fileStorage("bloomFilterStorage.txt") {
        input = new fileStorage("input.txt");
        urls = new fileStorage("urls.txt");
        filter = new fileStorage("filter.txt");

        input->save(convertVectorIntToString(inputData));
        urls->save(urlsData);
        filter->save(convertVectorCharToString(filterData));
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
        input->save(convertVectorIntToString(data));
    }
    void bloomFilterStorage::save(const vector<char> data) {
        filter->save(convertVectorCharToString(data));
    }
    vector<int> bloomFilterStorage::loadInput() {
        string data = input->load().value_or("");
        return convertStringToIntVector(data);
    }
    string bloomFilterStorage::loadUrls() {
        return urls->load().value_or("");
    }
    vector<char> bloomFilterStorage::loadFilterArray() {
        string data = filter->load().value_or("");
        return convertStringToCharVector(data);
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
        return input->exists(convertVectorIntToString(data));
    }
    bool bloomFilterStorage::exists(const vector<char> data) {
        return filter->exists(convertVectorCharToString(data));
    }
    void bloomFilterStorage::remove(const string& data) {
        urls->remove(data);
    }
    void bloomFilterStorage::remove(const vector<int> data) {
        input->remove(convertVectorIntToString(data));
    }
    void bloomFilterStorage::remove(const vector<char> data) {
        filter->remove(convertVectorCharToString(data));
    }
    void bloomFilterStorage::remove() {
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
            result += to_string(val);
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
        string item;
        while (getline(ss, item, ',')) {
            result.push_back(stoi(item));
        }
        return result;
    }

    vector<char> bloomFilterStorage::convertStringToCharVector(const string& data) const {
        vector<char> result;
        stringstream ss(data);
        string item;
        while (getline(ss, item, ',')) {
            result.push_back(stoi(item));
        }
        return result;
    }
    

    
    
;
