/**
 * @fileoverview Blacklist Data Model
 * 
 * This module provides data management functionality for URL blacklisting in the email system.
 * It communicates with a Bloom filter-based backend system through client processes to
 * efficiently manage URL blacklisting operations. The backend uses a TCP server-client
 * architecture with Docker containers for isolation and scalability.
 * 
 * The model handles:
 * - Adding URLs to the blacklist (POST operations)
 * - Checking if URLs are blacklisted (GET operations)  
 * - Removing URLs from the blacklist (DELETE operations)
 * 
 * @author AP-Email Team
 * @version 1.0.0
 */

// This file defines the model for managing blacklisted URLs in the application.

const fs = require('fs');
const path = require('path');
const { exec, spawn } = require('child_process');
const startClientScript = path.join(__dirname, '..', '..', 'start-client.sh');

// Note: start-client.sh needs to be run separately with IP and port arguments
// For now, we'll create a function that runs the client for each command

/**
 * Sends a command to the blacklist server via client process
 * 
 * @function sendCommand
 * @description Creates a new Docker client process for each command and communicates
 * with the blacklist server. The client connects to the server at 127.0.0.1:8091
 * and sends the specified command via stdin.
 * 
 * @param {string} command - The command to send to the server (GET/POST/DELETE + URL)
 * 
 * @returns {Promise<string>} Promise that resolves with the server response
 * @throws {Error} When the client process fails or returns non-zero exit code
 * 
 * @example
 * // Internal usage only
 * sendCommand('POST http://example.com')
 *   .then(response => console.log('Server response:', response))
 *   .catch(error => console.error('Command failed:', error));
 */
// Helper to send a command and get a response from the client process
function sendCommand(command) {
    return new Promise((resolve, reject) => {
        // Start a new client process for each command
        const clientProc = spawn('bash', [startClientScript, '127.0.0.1', '8091'], {
            stdio: ['pipe', 'pipe', 'pipe'],
            cwd: path.dirname(startClientScript)
        });

        let data = '';
        let error = '';
        
        clientProc.stdout.on('data', (chunk) => {
            data += chunk.toString();
        });
        
        clientProc.stderr.on('data', (chunk) => {
            error += chunk.toString();
        });
        
        clientProc.on('close', (code) => {
            if (code === 0 && data.trim()) {
                resolve(data.trim());
            } else {
                reject(new Error(`Client process failed with code ${code}. Error: ${error}`));
            }
        });
        
        // Send the command to the client
        clientProc.stdin.write(command + '\n');
        clientProc.stdin.end();
    });
}

/**
 * Removes a URL from the blacklist
 * 
 * @function deleteFromBlacklist
 * @description Sends a DELETE command to the blacklist server to remove a URL.
 * Note that due to Bloom filter characteristics, this removes the URL from
 * storage but may not completely remove it from the filter itself.
 * 
 * @param {string} id - The URL to remove from the blacklist
 * 
 * @returns {Promise<string>} Promise that resolves with server confirmation
 * @throws {Error} When the deletion operation fails
 * 
 * @example
 * deleteFromBlacklist('http://malicious-site.com')
 *   .then(result => console.log('URL removed:', result))
 *   .catch(error => console.error('Deletion failed:', error));
 */
const deleteFromBlacklist = (id) => {
    return sendCommand(`DELETE ${id}`);
};

/**
 * Retrieves blacklist status for a specific URL
 * 
 * @function getBlacklistedURLById
 * @description Sends a GET command to check if a URL is in the blacklist.
 * Uses Bloom filter for efficient lookup with possible false positives
 * but no false negatives.
 * 
 * @param {string} id - The URL to check in the blacklist
 * 
 * @returns {Promise<string>} Promise that resolves with blacklist status information
 * @throws {Error} When the lookup operation fails
 * 
 * @example
 * getBlacklistedURLById('http://suspicious-site.com')
 *   .then(status => console.log('Blacklist status:', status))
 *   .catch(error => console.error('Lookup failed:', error));
 */
const getBlacklistedURLById = (id) => {
    return sendCommand(`GET ${id}`);
};

/**
 * Adds a URL to the blacklist
 * 
 * @function createBlacklistedURL
 * @description Sends a POST command to add a URL to the blacklist.
 * The URL is processed through hash functions and stored in the Bloom filter
 * for efficient future lookups.
 * 
 * @param {string} id - The URL to add to the blacklist
 * 
 * @returns {Promise<string>} Promise that resolves with server confirmation
 * @throws {Error} When the creation operation fails
 * 
 * @example
 * createBlacklistedURL('http://malicious-site.com')
 *   .then(result => console.log('URL blacklisted:', result))
 *   .catch(error => console.error('Blacklisting failed:', error));
 */
const createBlacklistedURL = (id) => {
    return sendCommand(`POST ${id}`);
};

module.exports= { deleteFromBlacklist, getBlacklistedURLById, createBlacklistedURL };
