#include <app.h>
#include "cli.cpp"

void App::run() {
    // Initialize CLI menu and run it.
    CLI* menu = new CLI();
    menu->run();
}

void App::run(int sock, BloomFilter<string, MyHash> bloomFilter) {
    // Initialize CLI menu and run it.
    CLI* menu = new CLI();
    menu->run(sock, bloomFilter);
}