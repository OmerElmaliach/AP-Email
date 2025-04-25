#include "bloomFilterStorage.h"
#include "fileStorage.h"
#include <fstream>
#include <filesystem>
#include <stdexcept>
#include <string>
#include <vector>
#include <optional>

using namespace std;

bloomFilterStorage::bloomFilterStorage() {
    input = new fileStorage<vector<int>>("input.txt");
    urls = new fileStorage<string>("urls.txt");
    filter = new fileStorage<int*>("filter.txt");
}

bloomFilterStorage::bloomFilterStorage(const vector<int>& inputData, const string& urlsData, int* filterData) {
    input = new fileStorage<vector<int>>("input.txt");
    urls = new fileStorage<string>("urls.txt");
    filter = new fileStorage<int*>("filter.txt");
    
    save(inputData);
    save(urlsData);
    save(filterData);
}

bloomFilterStorage::~bloomFilterStorage() {
    delete input;
    delete urls;
    delete filter;
}

// Getters
fileStorage<vector<int>>& bloomFilterStorage::getInput() {
    return *input;
}

fileStorage<string>& bloomFilterStorage::getUrls() {
    return *urls;
}

fileStorage<int*>& bloomFilterStorage::getFilter() {
    return *filter;
}

// Setters
void bloomFilterStorage::setInput(const fileStorage<vector<int>>& newInput) {
    delete input;
    input->save(newInput.load().value_or(vector<int>())); // Save the new input data
}

void bloomFilterStorage::setUrls(const fileStorage<string>& newUrls) {
    delete urls;
    urls->save(newUrls.load().value_or(string())); // Save the new URLs data
}

void bloomFilterStorage::setFilter(const fileStorage<int*>& newFilter) {
    delete filter;
    filter->save(newFilter.load().value_or(nullptr)); // Save the new filter data
}

// Storage operations
bool bloomFilterStorage::save(const vector<int>& data) {
    return input->save(data);
}

bool bloomFilterStorage::save(const string& data) {
    return urls->save(data);
}

bool bloomFilterStorage::save(int* data) {
    return filter->save(data);
}

optional<vector<int>> bloomFilterStorage::loadInput() const {
    return input->load();
}

optional<string> bloomFilterStorage::loadUrls() const {
    return urls->load();
}

optional<int*> bloomFilterStorage::loadFilter() const {
    return filter->load();
}

bool bloomFilterStorage::exists() const {
    return input->exists() || urls->exists() || filter->exists();
}

void bloomFilterStorage::remove() {
    input->remove();
    urls->remove();
    filter->remove();
}

void bloomFilterStorage::remove(const vector<int>& data) {
    input->remove(data);
}

void bloomFilterStorage::remove(const string& data) {
    urls->remove(data);
}

void bloomFilterStorage::remove(int* data) {
    filter->remove(data);
}