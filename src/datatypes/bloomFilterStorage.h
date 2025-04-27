#ifndef BLOOM_FILTER_STORAGE_H
#define BLOOM_FILTER_STORAGE_H

#include <vector>
#include <string>
#include "Istorage.h"
#include "fileStorage.h"

using namespace std;

class bloomFilterStorage : public fileStorage {
private:
    fileStorage* input;
    fileStorage* urls;
    fileStorage* filter;

    // Helper function to convert int* to string
    string convertIntToString(const int* data) const;
    // Helper function to convert vector<int> to string
    string convertVectorToString(const vector<int>& data) const;
    // Helper function to convert string to int*
    int* convertStringToInt(const string& data) const;
    // Helper function to convert string to vector<int>
    vector<int> convertStringToVector(const string& data) const;


public:
    explicit bloomFilterStorage();
    explicit bloomFilterStorage(const vector<int>& input, const string& urls, const int* filter);
    ~bloomFilterStorage();

    void save(const string& data) override;
    void save(const vector<int> data);
    void save(const int* data);

    vector<int> loadInput();
    string loadUrls();
    int* loadFilterArray();

    bloomFilterStorage& loadBloomFilter();

    bool exists() const override;
    bool exists(const string& data) const override;
    bool exists(const vector<int> data);
    bool exists(const int* data);

    void remove(const string& data) override;
    void remove(const vector<int> data);
    void remove(const int* data);
    void remove() override;

    // Getters
    fileStorage& getInput();
    fileStorage& getUrls();
    fileStorage& getFilter();
    // Setters
    void setInput(const fileStorage& newInput);
    void setUrls(const fileStorage& newUrls);
    void setFilter(const fileStorage& newFilter);
};

#endif
