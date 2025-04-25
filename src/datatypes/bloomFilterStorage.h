#ifndef BLOOM_FILTER_STORAGE_H
#define BLOOM_FILTER_STORAGE_H

#include <vector>
#include <string>
#include "Istorage.h"
#include "fileStorage.h"

using namespace std;

template <typename T>
class bloomFilterStorage : public IStorage {
private:
    fileStorage<vector<int>>* input;
    fileStorage<string>* urls;
    fileStorage<int*>* filter;

public:
    bloomFilterStorage();
    bloomFilterStorage(const vector<int>& input, const string& urls, const int* filter);
    ~bloomFilterStorage();

    void save(const vector<int> data) override;
    void save(const string& data) override;
    void save(const char* data) override;

    vector<int> loadInput();
    string loadUrls();
    int* loadFilter();

    bloomFilterStorage& load();

    bool exists() const override;

    void remove(const vector<int> data) override;
    void remove(const string& data) override;
    void remove(const int* data) override;
    void remove() override;
};

#endif
