#ifndef BLOOM_FILTER_STORAGE_H
#define BLOOM_FILTER_STORAGE_H

#include <vector>
#include <string>
#include <Istorage.h>
#include <fileStorage.h>

using namespace std;

class bloomFilterStorage : public fileStorage {
private:
    fileStorage* input;
    fileStorage* urls;
    fileStorage* filter;

    // Helper function to convert int* to string
    string convertVectorCharToString(const vector<char>& data) const;
    // Helper function to convert vector<int> to string
    string convertVectorIntToString(const vector<int>& data) const;
    // Helper function to convert string to vector<char>
    vector<char> convertStringToCharVector(const string& data) const;
    // Helper function to convert string to vector<int>
    vector<int> convertStringToIntVector(const string& data) const;


public:
    explicit bloomFilterStorage();
    explicit bloomFilterStorage(const vector<int>& input, const string& urls, const vector<char> filter);
    ~bloomFilterStorage();

    void save(const string& data) override;
    void save(const vector<int>& data);
    void save(const vector<char>& data);

    vector<int> loadInput();
    string loadUrls();
    vector<char> loadFilterArray();

    bloomFilterStorage& loadBloomFilter();

    bool exists() const override;
    bool exists(const string& data) const override;
    bool exists(const vector<int> data);
    bool exists(const vector<char> data);

    void remove(const string& data) override;
    void remove(const vector<int>& data);
    void remove(const vector<char>& data);
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
