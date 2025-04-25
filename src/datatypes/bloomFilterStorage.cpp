#include "fileStorage.h"
#include <fstream>
#include <filesystem>
#include <stdexcept>
#include "Istorage.h"
#include <string>
#include <vector>

using namespace std;
template <typename T>

class bloomFilterStorage : public IStorage {
    private:
        fileStorage<vector<int>> input;
        fileStorage<string> urls;
        fileStorage<int*> filter;
            
    public:
        bloomFilterStorage() {
            this.input = new fileStorage<vector<int>>("input.txt");
            this.urls = new fileStorage<string>("urls.txt");
            this.filter = new fileStorage<int*>("filter.txt");
        }
        bloomFilterStorage(const <vector<int>>& input, const string& urls, const int* filter) {
            this.input = new fileStorage<vector<int>>("input.txt");
            this.urls = new fileStorage<string>("urls.txt");
            this.filter = new fileStorage<int*>("filter.txt");
        }
        ~bloomFilterStorage() {
            delete input;
            delete urls;
            delete filter;
        }
    // Getters
        fileStorage<vector<int>>& getInput() {
            return input;
        }

        fileStorage<string>& getUrls() {
            return urls;
        }

        fileStorage<int*>& getFilter() {
            return filter;
        }

        // Setters
        void setInput(const fileStorage<vector<int>>& newInput) {
            input = newInput;
        }

        void setUrls(const fileStorage<string>& newUrls) {
            urls = newUrls;
        }

        void setFilter(const fileStorage<int*>& newFilter) {
            filter = newFilter;
        }
        void save(const <vector<int>> data) override {
            input.save(data);
        }
        void save(const string& data) override {
            urls.save(data);
        }
        void save(const char* data) override {
            filter.save(data);
        }
        bloomFilterStorage load() override {
            return new bloomFilterStorage(input.load(), urls.load(), filter.load());
        }
        vector loadInput() {
            return input.load();
        }
        string loadUrls() {
            return urls.load();
        }
        int* loadFilter() {
            return filter.load();
        }
        bloomFilterStorage load() {
            return new bloomFilterStorage(input.load(), urls.load(), filter.load());
        }
        bool exists() const override {
            return input.exists() || urls.exists() || filter.exists();
        }
        void remove(const <vector<int>> data) override {
            input.remove(data);
        }
        void remove(const string& data) override {
            urls.remove(data);
        }
        void remove(const int* data) override {
            filter.remove(data);
        }
        void remove() override {
            input.remove();
            urls.remove();
            filter.remove();
        }
    };