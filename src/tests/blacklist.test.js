// Quick test for blacklist model
const { deleteFromBlacklist, getBlacklistedURLById, createBlacklistedURL } = require('../js/models/blacklist.js');

async function runTests() {
    const testId = 'http://example.com/test-url';
    try {
        console.log('Creating blacklisted URL...');
        const createResult = await createBlacklistedURL(testId);
        console.log('Create result:', createResult);

        console.log('Getting blacklisted URL...');
        const getResult = await getBlacklistedURLById(testId);
        console.log('Get result:', getResult);

        console.log('Deleting blacklisted URL...');
        const deleteResult = await deleteFromBlacklist(testId);
        console.log('Delete result:', deleteResult);
    } catch (err) {
        console.error('Test failed:', err);
    }
}

runTests();
