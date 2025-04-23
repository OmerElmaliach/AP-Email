#include <string>
#include <vector>
#include <optional>

using std;
template <typename T>
class IStorage {
public:
    virtual ~IStorage() = default;
    
    // Save data to storage
    virtual bool save(const T& data) = 0;
    
    // Load data from storage
    virtual optional<T> load() = 0;
    
    // Check if data exists in storage
    virtual bool exists() const = 0;

    // Remove data from storage
    virtual void remove() = 0;
};