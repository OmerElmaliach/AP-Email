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
const clientScript = path.join(__dirname, '..', '..', 'client_socket.py');
const net = require('net');

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
// Helper to send a command and get a response from the C++ server via Python client
function sendCommand(command) {
    return new Promise((resolve, reject) => {
        // Parse the command to understand what operation to perform
        const parts = command.split(' ');
        const action = parts[0];
        let serverCommand;
        const url = parts.slice(1).join(' ');        
        switch (action) {
            case 'POST':
                serverCommand = `POST ${url}`;
                break;
            case 'GET':
                serverCommand = `GET ${url}`;
                break;
            case 'DELETE':
                serverCommand = `DELETE ${url}`;
                break;
            default:
                return reject(new Error(`Unknown command: ${action}`));
        }

        console.log(`[BLACKLIST] Sending server command: ${serverCommand}`);

        // Direct TCP connection to the C++ server
        const client = new net.Socket();
        let response = '';
        let errorOccurred = false;        // Use the Docker container name as the hostname for inter-container communication
        client.connect(8091, 'docker-server', () => {
            client.write(serverCommand + '\n');
        });client.on('data', (data) => {
            response += data.toString();
            // Process response immediately when data is received
            response = response.trim();
            console.log(`[BLACKLIST] Server response: ${response}`);
            
            // Close the connection and resolve the promise
            client.end();
            
            if (errorOccurred) return;
            
            if (action === 'POST') {
                resolve(`URL ${url} added to blacklist`);
            } else if (action === 'GET') {
                const isBlacklisted = response.includes('true') || response.includes('1') || response.toLowerCase().includes('yes');
                resolve(`URL ${url} is blacklisted: ${isBlacklisted}`);
            } else if (action === 'DELETE') {
                resolve(`URL ${url} removed from blacklist: true`);
            }
        });
        client.on('end', () => {
            // Connection ended - this is now just for cleanup
        });
        client.on('error', (err) => {
            errorOccurred = true;
            console.error(`[BLACKLIST] TCP error: ${err.message}`);
            reject(new Error(`TCP connection failed: ${err.message}`));
        });
        // Timeout in case server does not respond
        client.setTimeout(10000, () => {
            errorOccurred = true;
            client.destroy();
            reject(new Error('TCP connection timed out'));
        });
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
