/**
 * @file bloomFilterStorage.h
 * @brief Defines the bloomFilterStorage class for managing Bloom filter-related persistent storage.
 */
#ifndef BLOOM_FILTER_STORAGE_H
#define BLOOM_FILTER_STORAGE_H

#include <vector>
#include <string>
#include <Istorage.h>
#include <fileStorage.h>

using namespace std;

/**
 * @class bloomFilterStorage
 * @brief Manages persistent storage for Bloom filter data, including input, URLs, and filter arrays.
 *
 * This class provides methods to save, load, check existence, and remove Bloom filter-related data.
 * It uses three fileStorage instances for input, URLs, and filter arrays.
 */
class bloomFilterStorage : public fileStorage {
private:
    fileStorage* input;   ///< Storage for input data (vector<int>).
    fileStorage* urls;    ///< Storage for URLs (string).
    fileStorage* filter;  ///< Storage for filter array (vector<char>).

    /**
     * @brief Convert a vector of chars to a comma-separated string.
     */
    string convertVectorCharToString(const vector<char>& data) const;
    /**
     * @brief Convert a vector of ints to a comma-separated string.
     */
    string convertVectorIntToString(const vector<int>& data) const;
    /**
     * @brief Convert a string to a vector of chars.
     */
    vector<char> convertStringToCharVector(const string& data) const;
    /**
     * @brief Convert a string to a vector of ints.
     */
    vector<int> convertStringToIntVector(const string& data) const;

public:
    /**
     * @brief Default constructor. Initializes storage files for input, URLs, and filter.
     */
    explicit bloomFilterStorage();
    /**
     * @brief Constructs with initial data for input, URLs, and filter.
     */
    explicit bloomFilterStorage(const vector<int>& input, const string& urls, const vector<char> filter);
    /**
     * @brief Destructor. Cleans up fileStorage pointers.
     */
    ~bloomFilterStorage();

    /**
     * @brief Save a URL string to storage.
     */
    void save(const string& data) override;
    /**
     * @brief Save input data (vector<int>) to storage.
     */
    void save(const vector<int>& data);
    /**
     * @brief Save filter array (vector<char>) to storage.
     */
    void save(const vector<char>& data);

    /**
     * @brief Load input data as a vector of ints.
     */
    vector<int> loadInput();
    /**
     * @brief Load URLs as a string.
     */
    string loadUrls();
    /**
     * @brief Load filter array as a vector of chars.
     */
    vector<char> loadFilterArray();

    /**
     * @brief Load the Bloom filter storage object (self).
     */
    bloomFilterStorage& loadBloomFilter();

    /**
     * @brief Check if any data exists in any of the storage files.
     */
    bool exists() const override;
    /**
     * @brief Check if a specific URL exists in storage.
     */
    bool exists(const string& data) const override;
    /**
     * @brief Check if specific input data exists in storage.
     */
    bool exists(const vector<int> data);
    /**
     * @brief Check if a specific filter array exists in storage.
     */
    bool exists(const vector<char> data);

    /**
     * @brief Remove a specific URL from storage.
     */
    void remove(const string& data) override;
    /**
     * @brief Remove specific input data from storage.
     */
    void remove(const vector<int>& data);
    /**
     * @brief Remove a specific filter array from storage.
     */
    void remove(const vector<char>& data);
    /**
     * @brief Remove all data from all storage files.
     */
    void remove() override;

    /**
     * @brief Getters for the underlying fileStorage objects.
     */
    fileStorage& getInput();
    fileStorage& getUrls();
    fileStorage& getFilter();
    /**
     * @brief Setters for the underlying fileStorage objects.
     */
    void setInput(const fileStorage& newInput);
    void setUrls(const fileStorage& newUrls);
    void setFilter(const fileStorage& newFilter);
};

#endif
