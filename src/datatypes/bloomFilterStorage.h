#ifndef BLOOM_FILTER_STORAGE_H
#define BLOOM_FILTER_STORAGE_H

#include <vector>
#include <string>
#include <optional>
#include "Istorage.h"
#include "fileStorage.h"

using namespace std;

class bloomFilterStorage {
private:
    fileStorage<vector<int>>* input;
    fileStorage<string>* urls;
    fileStorage<int*>* filter;

public:
    bloomFilterStorage();
    bloomFilterStorage(const vector<int>& inputData, const string& urlsData, int* filterData);
    ~bloomFilterStorage();

    // Getters
    fileStorage<vector<int>>& getInput();
    fileStorage<string>& getUrls();
    fileStorage<int*>& getFilter();

    // Setters
    void setInput(const fileStorage<vector<int>>& newInput);
    void setUrls(const fileStorage<string>& newUrls);
    void setFilter(const fileStorage<int*>& newFilter);

    // Storage operations
    bool save(const vector<int>& data);
    bool save(const string& data);
    bool save(int* data);

    std::optional<vector<int>> loadInput() const;
    std::optional<string> loadUrls() const;
    std::optional<int*> loadFilter() const;

    bool exists() const;

    void remove();  // Remove all data
    
    // Remove specific data
    void remove(const vector<int>& data);
    void remove(const string& data);
    void remove(int* data);
};

#endif